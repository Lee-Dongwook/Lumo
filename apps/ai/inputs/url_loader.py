import requests
from bs4 import BeautifulSoup

def extract_text_from_url(url:str) -> str:
    response = requests.get(url, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    for tag in soup(['script','style','noscript']):
        tag.decompose()

    text = " ".join(soup.stripped_strings)
    return text