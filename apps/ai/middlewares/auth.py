from typing import Optional
from fastapi import Request, HTTPException, WebSocket, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from ..core.auth import verify_token, TokenData

# Security scheme for HTTP Bearer token
security = HTTPBearer()

class UserContext(BaseModel):
    """User context extracted from JWT token."""
    id: str
    email: str
    token_data: TokenData

class AuthError(HTTPException):
    """Custom authentication error."""
    def __init__(self, detail: str = "Authentication failed"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"}
        )

def extract_token_from_header(authorization: str) -> str:
    """
    Extract token from Authorization header.
    
    Args:
        authorization: Authorization header value
        
    Returns:
        Token string
        
    Raises:
        AuthError: If token format is invalid
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise AuthError("Missing or invalid authorization header")
    
    return authorization.split(" ")[1]

def extract_token_from_query(token: Optional[str]) -> str:
    """
    Extract token from query parameter.
    
    Args:
        token: Token from query parameter
        
    Returns:
        Token string
        
    Raises:
        AuthError: If token is missing
    """
    if not token:
        raise AuthError("Missing token parameter")
    
    return token

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> UserContext:
    """
    Get current user from HTTP Bearer token.
    
    Args:
        credentials: HTTP Bearer credentials
        
    Returns:
        UserContext with user information
        
    Raises:
        AuthError: If token is invalid or expired
    """
    token = credentials.credentials
    token_data = verify_token(token)
    
    if not token_data:
        raise AuthError("Invalid or expired token")
    
    return UserContext(
        id=token_data.sub,
        email=token_data.email,
        token_data=token_data
    )

async def get_current_user_optional(
    request: Request
) -> Optional[UserContext]:
    """
    Get current user optionally (for endpoints that don't require auth).
    
    Args:
        request: FastAPI request object
        
    Returns:
        UserContext if valid token provided, None otherwise
    """
    auth_header = request.headers.get("authorization")
    if not auth_header:
        return None
    
    try:
        token = extract_token_from_header(auth_header)
        token_data = verify_token(token)
        
        if not token_data:
            return None
        
        return UserContext(
            id=token_data.sub,
            email=token_data.email,
            token_data=token_data
        )
    except AuthError:
        return None

async def get_current_user_ws(websocket: WebSocket) -> UserContext:
    """
    Get current user from WebSocket query parameter.
    
    Args:
        websocket: WebSocket connection
        
    Returns:
        UserContext with user information
        
    Raises:
        AuthError: If token is invalid or expired
    """
    token = websocket.query_params.get("token")
    token = extract_token_from_query(token)
    
    token_data = verify_token(token)
    if not token_data:
        await websocket.close(code=1008, reason="Invalid token")
        raise AuthError("Invalid or expired token")
    
    return UserContext(
        id=token_data.sub,
        email=token_data.email,
        token_data=token_data
    )

# Dependency for endpoints that require authentication
def require_auth() -> UserContext:
    """Dependency that requires authentication."""
    return get_current_user

# Dependency for endpoints that optionally support authentication
def optional_auth() -> Optional[UserContext]:
    """Dependency that optionally supports authentication."""
    return get_current_user_optional 