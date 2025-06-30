from uuid import uuid4
from supa.client import supabase

BUCKET_NAME = "call-responses"

def upload_audio(user_id:str, audio_bytes:bytes) -> str:
    file_path = f"{user_id}/{uuid4()}.mp3"

    try:
        supabase.storage.from_(BUCKET_NAME).upload(
            path=file_path,
            file=audio_bytes,
        )
    except Exception as e:
        raise RuntimeError(f"Failed to upload audio: {str(e)}")
    
    url = supabase.storage.from_(BUCKET_NAME).get_public_url(file_path)
    return url