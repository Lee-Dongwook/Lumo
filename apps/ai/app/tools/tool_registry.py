from langchain.tools import Tool
# from langchain_community.utilities import SerpAPIWrapper
# from app.services.summarizer import summarize
from app.tools.code import get_code_tools


def get_tools():
    """모든 AI 도구들을 반환합니다."""
    tools = []
    
    # 코드 관련 도구들 추가
    tools.extend(get_code_tools())
    
    # 기타 도구들 (나중에 활성화)
    # tools.append(
    #     Tool.from_function(
    #         name="summarize_text",
    #         func=summarize,
    #         description="긴 텍스트를 요약합니다."
    #     )
    # )
    # tools.append(
    #     Tool.from_function(
    #         name="search_web",
    #         func=SerpAPIWrapper().run,
    #         description="웹에서 실시간 정보를 검색합니다."
    #     )
    # )
    
    return tools