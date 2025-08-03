from gtts import gTTS
import io

def synthesize(text: str, voice_id: str = "ko") -> bytes:
    """
    텍스트를 오디오로 변환합니다.
    """
    tts = gTTS(text=text, lang=voice_id)
    audio_buffer = io.BytesIO()
    tts.write_to_fp(audio_buffer)
    audio_buffer.seek(0)
    return audio_buffer.read() 