"""
Middleware module for AI application.

This module contains:
- Authentication middleware
- Request/response processing
"""

from .auth import (
    get_current_user,
    get_current_user_optional,
    get_current_user_ws,
    require_auth,
    optional_auth,
    UserContext,
    AuthError
)

__all__ = [
    "get_current_user",
    "get_current_user_optional",
    "get_current_user_ws", 
    "require_auth",
    "optional_auth",
    "UserContext",
    "AuthError"
] 