"""
API v1 module for AI application.

This module contains:
- Authentication routes
- Learning schedule routes
- Research routes
- General routes
- Chat routes
"""

from . import auth, chat, learning, research, routes

__all__ = [
    "auth",
    "chat", 
    "learning",
    "research",
    "routes"
] 