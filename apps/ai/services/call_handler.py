from ai.services.stt_client import transcribe
from ai.services.tts_client import synthesize
from agents.phone_conversation_agent import agent_executor

class CallHandler:
    def __init__(self, voice_id):
        self.voice_id = voice_id

    def handle_audio_file(self, audio_path:str) -> bytes:
        """Twilio에서 받은 오디오 파일 -> 응답 오디오 바이트"""
        text = transcribe(audio_path)
        result = agent_executor.invoke({"user_input": text})
        return synthesize(result["response"], self.voice_id)
