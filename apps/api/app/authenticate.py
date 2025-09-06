import os
from typing import Optional

from fastapi import Depends, HTTPException, status, Request
from google.auth.transport import requests
from google.oauth2 import id_token
from sqlalchemy.orm import Session

from .database import get_db
from .db_models import User

# Google OAuth Configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")


def verify_google_token(token: str) -> dict:
    """Verify Google ID token and return user info"""
    try:
        # Specify the CLIENT_ID of the app that accesses the backend
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        return idinfo
    except ValueError:
        # Invalid token
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
):
    """Get current user from email header (NextAuth integration)"""
    # Get email from header (NextAuth integration)
    user_email = request.headers.get("X-User-Email")
    if user_email:
        user = db.query(User).filter(User.email == user_email).first()
        if user:
            return user
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated"
    )

# Only import get_current_user here, after all other imports and definitions
__all__ = ["get_current_user"]
