import os
from openai import OpenAI
from ai.config.settings import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def call_llm(prompt: str, model: str = 'gpt-3.5-turbo') -> str:
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role":"system", "content":"You are an expert research assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=1024
    )
    return response.choices[0].message.content.strip() # type: ignore