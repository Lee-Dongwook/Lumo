from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain.tools import Tool

def fake_summary_tool(text:str) -> str:
    return f"Summary: {text[:100]}..."

summary_tool = Tool.from_function(
    func= fake_summary_tool,
    name='summarize',
    description="Summarizes a given string of text."
)

def build_graph():
    builder = StateGraph()

    builder.add_node("summarize", ToolNode(summary_tool)) # type: ignore

    builder.set_entry_point("summarize")
    builder.set_finish_point(END)

    builder.add_edge("summarize", END)

    return builder.compile()

def run_graph(input_text:str):
    graph = build_graph()
    return graph.invoke({"input": input_text})