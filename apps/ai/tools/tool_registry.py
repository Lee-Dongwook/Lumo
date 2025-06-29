from langchain.tools import Tool
from langchain.utilities import SerpAPIWrapper
from services.summarizer import summarize


def get_tools():
    return [
        Tool.from_function(
            name="summarize_text",
            func=summarize,
            description="긴 텍스트를 요약합니다."
        ),
        Tool.from_function(
            name="search_web",
            func=SerpAPIWrapper().run,
            description="웹에서 실시간 정보를 검색합니다."
        ),
    ]