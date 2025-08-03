import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import time

def crawl_url(url: str, max_depth: int = 2) -> dict:
    """
    URL을 크롤링하여 관련 링크와 콘텐츠를 수집합니다.
    """
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # 메인 콘텐츠 추출
        content = extract_main_content(soup)
        
        # 관련 링크 수집
        links = extract_links(soup, url, max_depth)
        
        return {
            'url': url,
            'content': content,
            'links': links,
            'title': soup.title.string if soup.title else '',
            'status': 'success'
        }
        
    except Exception as e:
        return {
            'url': url,
            'content': '',
            'links': [],
            'title': '',
            'status': f'error: {str(e)}'
        }

def extract_main_content(soup: BeautifulSoup) -> str:
    """
    웹페이지에서 메인 콘텐츠를 추출합니다.
    """
    # 불필요한 태그 제거
    for tag in soup(['script', 'style', 'nav', 'header', 'footer', 'aside']):
        tag.decompose()
    
    # 텍스트 추출
    text = soup.get_text()
    
    # 공백 정리
    lines = (line.strip() for line in text.splitlines())
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    text = ' '.join(chunk for chunk in chunks if chunk)
    
    return text

def extract_links(soup: BeautifulSoup, base_url: str, max_depth: int) -> list:
    """
    웹페이지에서 관련 링크를 추출합니다.
    """
    links = []
    
    for link in soup.find_all('a', href=True):
        href = link['href']
        absolute_url = urljoin(base_url, href)
        
        # 같은 도메인의 링크만 수집
        if urlparse(absolute_url).netloc == urlparse(base_url).netloc:
            links.append({
                'url': absolute_url,
                'text': link.get_text().strip(),
                'depth': 1
            })
    
    return links[:max_depth * 10]  # 링크 수 제한 