"""
Chat Agent
채팅 에이전트 구현
"""

from typing import List, TypedDict, Dict, Any
from langgraph.graph import StateGraph
from langchain_core.messages import AIMessage, BaseMessage
from langchain_core.runnables import RunnableLambda
from langgraph.prebuilt import chat_agent_executor
from langchain_openai import ChatOpenAI
from app.tools.tool_registry import get_tools
from app.core.config import settings


class AgentState(TypedDict):
    """에이전트 상태 정의"""
    messages: List[BaseMessage]
    input: str
    response: str


def create_chat_agent() -> StateGraph:
    """채팅 에이전트 생성"""
    
    # 도구 및 LLM 설정
    tools = get_tools()
    llm = ChatOpenAI(
        model=settings.DEFAULT_MODEL,
        temperature=0,
        api_key=settings.OPENAI_API_KEY
    )
    
    # 그래프 생성
    graph = chat_agent_executor.create_tool_calling_executor(llm, tools)
    
    def add_to_message_history(state: Dict[str, Any]) -> Dict[str, Any]:
        """메시지 히스토리에 응답 추가"""
        messages = state.get('messages', [])
        if 'response' in state:
            messages.append(AIMessage(content=state["response"]))
        return {"messages": messages}
    
    # 상태 그래프 구성
    builder = StateGraph(AgentState)
    builder.add_node("agent", graph)
    builder.add_node("accumulate", RunnableLambda(add_to_message_history))
    
    # 엣지 설정
    builder.set_entry_point("agent")
    builder.add_edge("agent", "accumulate")
    builder.add_edge("accumulate", "agent")
    
    return builder.compile()


# 전역 에이전트 인스턴스
agent = create_chat_agent()