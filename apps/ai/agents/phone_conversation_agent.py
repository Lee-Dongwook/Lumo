from langgraph.graph import StateGraph
from langchain.chat_models import ChatOpenAI
from ai.services.memory_store import get_memory

llm = ChatOpenAI(model="gpt-3.5-turbo") # type: ignore
memory = get_memory()

def respond(state):
    input_text = state["user_input"]
    response = llm.predict(input=input_text)
    memory.save_context({"input": input_text}, {"output": response})
    return {"response": response}

builder = StateGraph()
builder.add_node("respond", respond)
builder.set_entry_point("respond")
agent_executor = builder.compile()