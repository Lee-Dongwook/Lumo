"""
SocketIO module for AI application.

This module contains:
- Signaling events for WebRTC
- Chat WebSocket handlers
"""

from .signaling_events import *
from .chat import router as chat_router

__all__ = [
    "chat_router"
] 