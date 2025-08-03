"""
Phone Conversation Agent
전화 통화 에이전트 구현
"""

from typing import TypedDict, Dict, Any
from langgraph.graph import StateGraph
from langchain_openai import ChatOpenAI
from app.services.memory_store import get_memory
from app.core.config import settings


class AgentState(TypedDict):
    """에이전트 상태 정의"""
    user_input: str
    response: str


def create_phone_agent() -> StateGraph:
    """전화 통화 에이전트 생성"""
    
    # LLM 및 메모리 설정
    llm = ChatOpenAI(
        model=settings.DEFAULT_MODEL,
        temperature=0.7,  # 전화 통화는 더 자연스럽게
        api_key=settings.OPENAI_API_KEY
    )
    memory = get_memory()
    
    def respond(state: Dict[str, Any]) -> Dict[str, str]:
        """사용자 입력에 대한 응답 생성"""
        input_text = state["user_input"]
        
        # LLM을 사용한 응답 생성
        response = llm.predict(input=input_text, text=input_text)
        
        # 메모리에 대화 저장
        memory.save_context(
            {"input": input_text}, 
            {"output": response}
        )
        
        return {"response": response}
    
    # 상태 그래프 구성
    builder = StateGraph(AgentState)
    builder.add_node("respond", respond)
    builder.set_entry_point("respond")
    
    return builder.compile()


# 전역 에이전트 인스턴스
agent_executor = create_phone_agent()