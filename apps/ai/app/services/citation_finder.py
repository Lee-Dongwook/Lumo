from app.models.llm import call_llm

CITATION_PROMPT = """
You are an expert research assistant. Analyze the following text and identify key claims, facts, or statements that would benefit from citations or references.

Text to analyze:
{text}

For each important claim or fact, provide:
1. A brief description of what needs citation
2. The type of source that would be most appropriate (e.g., academic paper, news article, official document, etc.)
3. A suggested search query to find relevant sources

Format your response as a numbered list.
"""

def attach_citations(text: str, model: str = 'gpt-3.5-turbo') -> str:
    """
    텍스트에서 인용이 필요한 부분을 식별하고 제안합니다.
    """
    prompt = CITATION_PROMPT.format(text=text)
    response = call_llm(prompt, model=model)
    return response 