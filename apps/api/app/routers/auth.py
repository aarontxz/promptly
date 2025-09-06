from datetime import timedelta
from typing import Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..auth import verify_google_token, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from ..database import get_db
from ..db_models import User as DBUser
from .. import schemas

router = APIRouter()


class GoogleTokenRequest(BaseModel):
    token: str


class UserSyncRequest(BaseModel):
    email: str
    name: str
    picture: Optional[str] = None
    google_id: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: schemas.User


@router.post("/auth/google", response_model=TokenResponse)
async def google_auth(
    token_request: GoogleTokenRequest,
    db: Session = Depends(get_db)
):
    """Authenticate with Google OAuth token"""
    try:
        # Verify Google token
        google_user_info = verify_google_token(token_request.token)
        
        # Extract user information
        email = google_user_info.get("email")
        name = google_user_info.get("name")
        google_id = google_user_info.get("sub")
        picture = google_user_info.get("picture")
        
        if not email or not google_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token: missing email or user ID"
            )
        
        # Check if user exists in database
        db_user = db.query(DBUser).filter(DBUser.email == email).first()
        
        if not db_user:
            # Create new user
            user_data = schemas.UserCreate(
                email=email,
                name=name or email,
                google_id=google_id,
                picture=picture
            )
            db_user = DBUser(
                email=user_data.email,
                name=user_data.name,
                google_id=user_data.google_id,
                picture=user_data.picture
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
        else:
            # Update existing user info
            db_user.name = name or db_user.name
            db_user.google_id = google_id
            db_user.picture = picture or db_user.picture
            db.commit()
            db.refresh(db_user)
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(db_user.id), "email": db_user.email},
            expires_delta=access_token_expires
        )
        
        # Convert db_user to Pydantic model
        user = schemas.User.model_validate(db_user)
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=user
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )


@router.post("/auth/sync-user", response_model=Dict)
async def sync_user(
    user_data: UserSyncRequest,
    db: Session = Depends(get_db)
):
    """Sync user from frontend session to backend database"""
    try:
        # Check if user exists in database
        db_user = db.query(DBUser).filter(DBUser.email == user_data.email).first()
        
        if not db_user:
            # Create new user
            db_user = DBUser(
                email=user_data.email,
                name=user_data.name,
                google_id=user_data.google_id,
                picture=user_data.picture
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
        else:
            # Update existing user info
            db_user.name = user_data.name or db_user.name
            db_user.google_id = user_data.google_id or db_user.google_id
            db_user.picture = user_data.picture or db_user.picture
            db.commit()
            db.refresh(db_user)
        
        # Convert db_user to Pydantic model
        user = schemas.User.model_validate(db_user)
        
        return {"user": user}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to sync user: {str(e)}"
        )


@router.get("/auth/me", response_model=schemas.User)
async def get_me(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user information"""
    # In a real app, you'd use the user ID from the token to fetch from DB
    # For now, return basic info from the token
    return {"message": "Current user info", "user": current_user}


@router.post("/auth/logout")
async def logout():
    """Logout endpoint (client should discard the token)"""
    return {"message": "Logged out successfully"}
