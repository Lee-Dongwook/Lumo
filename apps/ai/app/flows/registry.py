"""
Flow Registry
워크플로우들을 등록하고 관리하는 레지스트리
"""

from typing import Dict, Type, Any
from app.flows.base import BaseFlow


class FlowRegistry:
    """워크플로우 레지스트리"""
    
    def __init__(self):
        self._flows: Dict[str, Type[BaseFlow]] = {}
    
    def register(self, name: str, flow_class: Type[BaseFlow]):
        """워크플로우 등록"""
        self._flows[name] = flow_class
    
    def get_flow(self, name: str) -> Type[BaseFlow]:
        """워크플로우 가져오기"""
        if name not in self._flows:
            raise ValueError(f"워크플로우 '{name}'가 등록되지 않았습니다.")
        return self._flows[name]
    
    def list_flows(self) -> list[str]:
        """등록된 워크플로우 목록"""
        return list(self._flows.keys())
    
    def execute_flow(self, name: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """워크플로우 실행"""
        flow_class = self.get_flow(name)
        flow_instance = flow_class(name)
        
        if not flow_instance.validate_input(input_data):
            return {
                "status": "error",
                "message": "입력 데이터 검증 실패",
                "flow_name": name
            }
        
        try:
            return flow_instance.execute(input_data)
        except Exception as e:
            return flow_instance.handle_error(e)


# 전역 레지스트리 인스턴스
flow_registry = FlowRegistry() 