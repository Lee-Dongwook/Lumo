import whisper

def transcribe(audio_path: str) -> str:
    """
    오디오 파일을 텍스트로 변환합니다.
    """
    model = whisper.load_model("base")
    result = model.transcribe(audio_path)
    return result["text"] 