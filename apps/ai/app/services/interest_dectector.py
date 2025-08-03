from app.models.llm import call_llm

INTEREST_DETECTION_PROMPT = """
You are an expert at analyzing user interests and preferences. Analyze the following text and identify the user's interests, hobbies, or areas of focus.

Text to analyze:
{text}

Please identify:
1. Primary interests or hobbies
2. Professional or academic interests
3. Personal preferences or values
4. Any specific topics they seem passionate about

Format your response as a list of identified interests.
"""

def detect_interests(text: str, model: str = 'gpt-3.5-turbo') -> str:
    """
    텍스트에서 사용자의 관심사를 감지합니다.
    """
    prompt = INTEREST_DETECTION_PROMPT.format(text=text)
    response = call_llm(prompt, model=model)
    return response 