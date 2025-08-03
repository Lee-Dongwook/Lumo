"""
Base Agent Classes
에이전트의 기본 클래스들을 정의
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from langchain_openai import ChatOpenAI
from app.core.config import settings


class BaseAgent(ABC):
    """에이전트 기본 클래스"""
    
    def __init__(self, name: str, model: str = None, temperature: float = 0):
        self.name = name
        self.model = model or settings.DEFAULT_MODEL
        self.temperature = temperature
        self.llm = ChatOpenAI(
            model=self.model,
            temperature=self.temperature,
            api_key=settings.OPENAI_API_KEY
        )
    
    @abstractmethod
    def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """입력 데이터 처리"""
        pass
    
    def validate_input(self, input_data: Dict[str, Any]) -> bool:
        """입력 데이터 검증"""
        return True
    
    def handle_error(self, error: Exception) -> Dict[str, Any]:
        """오류 처리"""
        return {
            "status": "error",
            "message": str(error),
            "agent_name": self.name
        }


class ConversationalAgent(BaseAgent):
    """대화형 에이전트 기본 클래스"""
    
    def __init__(self, name: str, model: str = None, temperature: float = 0.7):
        super().__init__(name, model, temperature)
        self.conversation_history = []
    
    def add_to_history(self, user_input: str, response: str):
        """대화 히스토리에 추가"""
        self.conversation_history.append({
            "user": user_input,
            "assistant": response
        })
    
    def get_context(self) -> str:
        """대화 컨텍스트 생성"""
        if not self.conversation_history:
            return ""
        
        context = "이전 대화:\n"
        for i, conv in enumerate(self.conversation_history[-5:], 1):  # 최근 5개만
            context += f"{i}. 사용자: {conv['user']}\n"
            context += f"   어시스턴트: {conv['assistant']}\n"
        return context 