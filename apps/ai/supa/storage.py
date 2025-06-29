import io
from uuid import uuid4
from supa.client import supabase

BUCKET_NAME = "call-responses"

def upload_audio(user_id:str, audio_bytes: bytes) -> str:
    file_path = f"{user_id}/{uuid4()}.mp3"
    supabase.storage.from_(BUCKET_NAME).upload(
        path=file_path,
        file=io.BytesIO(audio_bytes),
        file_options={"content-type":"audio/mpeg"},
        upsert=True
    )
    url = supabase.storage.from_(BUCKET_NAME).get_public_url(file_path)
    return url