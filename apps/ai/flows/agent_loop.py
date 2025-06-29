from apps.ai.services.stt_client import transcribe
from apps.ai.services.tts_client import synthesize
from agents.phone_conversation_agent import agent_executor

"""
ElevenLabs Voice ID 필요
"""
VOICE_ID = "ELEVENLABSE_VOICE_ID"

def handle_call(audio_input):
    text = transcribe(audio_input)
    state = {"user_input": text}
    result = agent_executor.invoke(state)
    audio_output = synthesize(result["response"], VOICE_ID)
    return audio_output