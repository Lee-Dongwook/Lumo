from typing import List, TypedDict
from langgraph.graph import StateGraph
from langchain_core.messages import AIMessage, BaseMessage
from langchain_core.runnables import RunnableLambda
from langgraph.prebuilt import chat_agent_executor
from langchain_openai import ChatOpenAI
from ai.tools.tool_registry import get_tools

tools = get_tools()
llm = ChatOpenAI(model="gpt-3.5-turbo",temperature=0)
graph = chat_agent_executor.create_tool_calling_executor(llm, tools)

def add_to_message_history(state):
    messages = state.get('messages',[])
    if 'response' in state:
        messages.append(AIMessage(content=state["response"]))
    return {"messages":messages}

class AgentState(TypedDict):
    messages: List[BaseMessage]
    input: str
    response: str

builder = StateGraph(AgentState)
builder.add_node("agent", graph)
builder.add_node("accumulate", RunnableLambda(add_to_message_history))

builder.set_entry_point("agent")
builder.add_edge("agent", "accumulate")
builder.add_edge("accumulate", "agent")

agent= builder.compile()