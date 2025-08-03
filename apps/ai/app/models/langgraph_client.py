"""
LangGraph Client Model
LangGraph 관련 모델 및 클라이언트
"""

from typing import Dict, Any, List
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain.tools import Tool
from app.core.config import settings


class LangGraphClient:
    """LangGraph 클라이언트"""
    
    def __init__(self):
        self.graphs: Dict[str, StateGraph] = {}
    
    def create_summary_tool(self) -> Tool:
        """요약 도구 생성"""
        def fake_summary_tool(text: str) -> str:
            return f"Summary: {text[:100]}..."
        
        return Tool.from_function(
            func=fake_summary_tool,
            name='summarize',
            description="Summarizes a given string of text."
        )
    
    def build_summary_graph(self) -> StateGraph:
        """요약 그래프 생성"""
        summary_tool = self.create_summary_tool()
        
        builder = StateGraph()
        builder.add_node("summarize", ToolNode(summary_tool))
        builder.set_entry_point("summarize")
        builder.set_finish_point(END)
        builder.add_edge("summarize", END)
        
        return builder.compile()
    
    def run_summary_graph(self, input_text: str) -> Dict[str, Any]:
        """요약 그래프 실행"""
        graph = self.build_summary_graph()
        return graph.invoke({"input": input_text})
    
    def register_graph(self, name: str, graph: StateGraph):
        """그래프 등록"""
        self.graphs[name] = graph
    
    def get_graph(self, name: str) -> StateGraph:
        """그래프 가져오기"""
        if name not in self.graphs:
            raise ValueError(f"그래프 '{name}'가 등록되지 않았습니다.")
        return self.graphs[name]
    
    def list_graphs(self) -> List[str]:
        """등록된 그래프 목록"""
        return list(self.graphs.keys())


# 전역 LangGraph 클라이언트 인스턴스
langgraph_client = LangGraphClient()


# 편의 함수들
def build_graph() -> StateGraph:
    """그래프 생성 편의 함수"""
    return langgraph_client.build_summary_graph()


def run_graph(input_text: str) -> Dict[str, Any]:
    """그래프 실행 편의 함수"""
    return langgraph_client.run_summary_graph(input_text) 