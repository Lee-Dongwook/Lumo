from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel

from .settings import settings

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class TokenData(BaseModel):
    sub: str
    email: str
    exp: Optional[datetime] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(
    data: Dict[str, Any], 
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token.
    
    Args:
        data: Dictionary containing token payload
        expires_delta: Optional custom expiration time
        
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.jwt_expire_minutes)
    
    to_encode.update({"exp": expire})
    
    return jwt.encode(
        to_encode, 
        settings.jwt_secret, 
        algorithm=settings.jwt_algorithm
    )

def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and verify a JWT token.
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded token payload or None if invalid
    """
    try:
        payload = jwt.decode(
            token, 
            settings.jwt_secret, 
            algorithms=[settings.jwt_algorithm]
        )
        return payload
    except JWTError:
        return None

def create_user_token(user_id: str, email: str) -> TokenResponse:
    """
    Create a token response for a user.
    
    Args:
        user_id: User ID
        email: User email
        
    Returns:
        TokenResponse with access token and metadata
    """
    data = {"sub": user_id, "email": email}
    access_token = create_access_token(data=data)
    
    return TokenResponse(
        access_token=access_token,
        expires_in=settings.jwt_expire_minutes * 60  # Convert to seconds
    )

def verify_token(token: str) -> Optional[TokenData]:
    """
    Verify and parse a token into TokenData.
    
    Args:
        token: JWT token string
        
    Returns:
        TokenData object or None if invalid
    """
    payload = decode_token(token)
    if not payload:
        return None
    
    try:
        return TokenData(
            sub=payload["sub"],
            email=payload["email"],
            exp=datetime.fromtimestamp(payload["exp"]) if "exp" in payload else None
        )
    except (KeyError, ValueError):
        return None 