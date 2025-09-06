from typing import Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..authenticate import get_current_user
from ..database import get_db
from ..db_models import User as DBUser
from .. import schemas

router = APIRouter()


class UserSyncRequest(BaseModel):
    email: str
    name: str
    google_id: str


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
                google_id=user_data.google_id
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
        else:
            # Update existing user info
            db_user.name = user_data.name or db_user.name
            db_user.google_id = user_data.google_id or db_user.google_id
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
