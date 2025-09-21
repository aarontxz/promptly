import os
from typing import Optional, Any, Dict
import json
from hkdf import Hkdf
from jose import jwt, jwe, JWTError

from fastapi import Depends, HTTPException, status, Request
from google.auth.transport import requests
from google.oauth2 import id_token
from sqlalchemy.orm import Session

from .database import get_db
from .db_models import User

# Google OAuth Configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
NEXTAUTH_SECRET = os.getenv("NEXTAUTH_SECRET")


def __encryption_key(secret: str):
    return Hkdf("", bytes(secret, "utf-8")).expand(b"NextAuth.js Generated Encryption Key", 32)


def encode_jwe(payload: Dict[str, Any], secret: str):
    data = bytes(json.dumps(payload), "utf-8")
    key = __encryption_key(secret)
    return bytes.decode(jwe.encrypt(data, key), "utf-8")


def decode_jwe(token: str, secret: str):
    decrypted = jwe.decrypt(token, __encryption_key(secret))

    if decrypted:
        return json.loads(bytes.decode(decrypted, "utf-8"))
    else:
        return None


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
    """Get current user from NextAuth JWT token"""
    authorization = request.headers.get("Authorization")
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    token = authorization.split(" ")[1]
    print(f"Token: {token}")  # Debug log
    try:
        print(f"Secret: {NEXTAUTH_SECRET}")  # Debug log
        # NextAuth uses JWE (encrypted JWT), so decrypt first
        decrypted_token = decode_jwe(token, NEXTAUTH_SECRET)
        if decrypted_token is None:
            raise Exception("Decryption failed")
        print(f"Decrypted token: {decrypted_token}")  # Debug log
        user_google_id = decrypted_token.get("id")
        print(f"User google_id: {user_google_id}")  # Debug log
        if user_google_id:
            user = db.query(User).filter(User.google_id == user_google_id).first()
            print(f"User found: {user}")  # Debug log
            if user:
                return user
    except Exception as e:
        print(f"Error: {e}")  # Debug log
        import traceback
        traceback.print_exc()
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated"
    )

# Only import get_current_user here, after all other imports and definitions
__all__ = ["get_current_user"]
