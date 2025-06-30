from googlesearch import search, SearchResult
import requests
from bs4 import BeautifulSoup

def google_search(query:str, num_results: int=5) -> list[str]:
    """구글 검색으로 URL 리스트 변환"""
    results = search(query, num_results=num_results, lang="ko")
    urls: list[str] = []

    for r in results:
        if isinstance(r, SearchResult):
            urls.append(r.url)
        elif isinstance(r,str):
            urls.append(r)
    return urls
   

def extract_text_from_url(url:str) -> str:
    """단일 URL에서 텍스트 추출"""
    try:
        response = requests.get(url, timeout=5)
        soup = BeautifulSoup(response.text, "html.parser")
        paragraphs = soup.find_all("p")
        return "\n".join([p.get_text().strip() for p in paragraphs])

    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""