from models.llm import call_llm

DEFAULT_PROMPT = """
You are an expert research assistant. Summarize the following content in a concise and informative way:

{text}

Return a summary in markdown bullet points.
"""

def summarize(text:str, model:str = 'gpt-3.5-turbo') -> str:
    propmt = DEFAULT_PROMPT.format(text=text)
    response = call_llm(propmt, model=model)
    return response