"""
Services module for AI application.

This module contains:
- Audio processing services (STT, TTS)
- Web crawling services
- Memory and storage services
- SocketIO services
- Analysis services (summarizer, citation finder, etc.)
"""

from .call_handler import CallHandler
from .summarizer import summarize
from .citation_finder import attach_citations
from .extractor import extract_key_information
from .interest_dectector import detect_interests
from .url_crawler import crawl_url
from .memory_store import set_memory, get_memory
from .s3_uploader import upload_to_s3
from .stt_client import transcribe
from .tts_client import synthesize
from .socketio_server import sio, sio_app
from .webrtc_handler import track_to_wav, transcribe_wav
from .tts_emit import synthesize_tts_gtts
from .gpt_mock_response import generate_mock_response
from .email_service import send_verification_email

__all__ = [
    "CallHandler",
    "summarize",
    "attach_citations", 
    "extract_key_information",
    "detect_interests",
    "crawl_url",
    "set_memory",
    "get_memory",
    "upload_to_s3",
    "transcribe",
    "synthesize",
    "sio",
    "sio_app",
    "track_to_wav",
    "transcribe_wav",
    "synthesize_tts_gtts",
    "generate_mock_response",
    "send_verification_email"
] 