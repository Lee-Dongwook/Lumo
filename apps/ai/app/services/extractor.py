from app.models.llm import call_llm

EXTRACTION_PROMPT = """
You are an expert research assistant. Extract key information from the following text and organize it into a structured format.

Text to analyze:
{text}

Please extract and organize the following information:
1. Main topics or themes
2. Key facts and figures
3. Important dates or time periods
4. Names of people, organizations, or places mentioned
5. Any conclusions or recommendations

Format your response as a structured summary with clear sections.
"""

def extract_key_information(text: str, model: str = 'gpt-3.5-turbo') -> str:
    """
    텍스트에서 핵심 정보를 추출하고 구조화합니다.
    """
    prompt = EXTRACTION_PROMPT.format(text=text)
    response = call_llm(prompt, model=model)
    return response 