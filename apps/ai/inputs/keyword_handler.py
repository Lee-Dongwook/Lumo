from typing import List
from models.llm import call_llm

KEYWORD_PROMPT = """
Extract 5-7 key topics or keywords from the following content. Return them as a comma-separated list.

{text}
"""

def extract_keywords(text:str) -> List[str]:
    prompt = KEYWORD_PROMPT.format(text=text)
    response = call_llm(prompt)
    keywords = [kw.strip()for kw in response.split(",") if kw.strip()]
    return keywords

