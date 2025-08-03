"""
Database module for AI application.

This module contains:
- Supabase client configuration
- Database operations
- Storage operations
"""

from .supabase_client import supabase, save_request
from .storage import upload_audio

__all__ = [
    "supabase",
    "save_request", 
    "upload_audio"
] 