"""
Agent Flow Management
AI 에이전트들의 워크플로우를 관리하는 모듈
"""

from typing import AsyncGenerator, Dict, Any
from app.services.stt_client import transcribe
from app.services.tts_client import synthesize
from app.agents.phone_conversation_agent import agent_executor
from app.agents.chat_agent import agent
from app.core.config import settings

# ElevenLabs Voice ID (환경변수에서 로드하도록 개선 필요)
VOICE_ID = "ELEVENLABSE_VOICE_ID"


def handle_call(audio_input: bytes) -> bytes:
    """
    전화 통화를 처리하는 워크플로우
    
    Args:
        audio_input: 입력 오디오 데이터
        
    Returns:
        출력 오디오 데이터
    """
    try:
        # 1. 음성을 텍스트로 변환
        text = transcribe(audio_input)
        
        # 2. 에이전트 실행
        state = {"user_input": text}
        result = agent_executor.invoke(state)
        
        # 3. 응답을 음성으로 변환
        audio_output = synthesize(result["response"], VOICE_ID)
        
        return audio_output
        
    except Exception as e:
        # 오류 처리
        error_response = f"죄송합니다. 오류가 발생했습니다: {str(e)}"
        return synthesize(error_response, VOICE_ID)


async def handle_chat_stream(text: str) -> AsyncGenerator[str, None]:
    """
    채팅 스트림을 처리하는 워크플로우
    
    Args:
        text: 사용자 입력 텍스트
        
    Yields:
        스트리밍 응답 청크
    """
    try:
        response_stream = agent.stream({"input": text})
        
        async for chunk in response_stream:
            yield chunk.get("output", "")
            
    except Exception as e:
        # 오류 처리
        error_message = f"죄송합니다. 오류가 발생했습니다: {str(e)}"
        yield error_message


def handle_research_flow(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    연구 워크플로우를 처리하는 함수
    
    Args:
        input_data: 입력 데이터
        
    Returns:
        연구 결과
    """
    try:
        # 연구 파이프라인 실행
        # TODO: 연구 파이프라인 구현
        return {
            "status": "success",
            "message": "연구 워크플로우가 실행되었습니다.",
            "data": input_data
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"연구 워크플로우 실행 중 오류: {str(e)}",
            "data": None
        }