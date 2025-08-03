from gtts import gTTS
import os
import uuid
import tempfile

def synthesize_tts_gtts(text:str, lang:str = 'ko') -> str:
    """
    gTTS로 텍스트를 mp3로 변환하고 임시 경로에 저장한 뒤 해당 경로 반환
    """
    tts = gTTS(text=text, lang=lang)
    path = os.path.join(tempfile.gettempdir(), f"tts_{uuid.uuid4().hex}.mp3")
    tts.save(path)
    return path 