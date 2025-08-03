"""
Base Flow Classes
워크플로우의 기본 클래스들을 정의
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from app.core.config import settings


class BaseFlow(ABC):
    """워크플로우 기본 클래스"""
    
    def __init__(self, name: str):
        self.name = name
        self.config = settings
    
    @abstractmethod
    def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """워크플로우 실행"""
        pass
    
    def validate_input(self, input_data: Dict[str, Any]) -> bool:
        """입력 데이터 검증"""
        return True
    
    def handle_error(self, error: Exception) -> Dict[str, Any]:
        """오류 처리"""
        return {
            "status": "error",
            "message": str(error),
            "flow_name": self.name
        }


class StreamingFlow(BaseFlow):
    """스트리밍 워크플로우 기본 클래스"""
    
    @abstractmethod
    async def execute_stream(self, input_data: Dict[str, Any]):
        """스트리밍 워크플로우 실행"""
        pass 