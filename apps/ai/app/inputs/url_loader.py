"""
URL Loader
URL에서 텍스트 추출 모듈
"""

import requests
from typing import Dict, Any, Optional
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from app.core.config import settings


class URLLoader:
    """URL 로더 클래스"""
    
    def __init__(self, timeout: int = 10):
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def extract_text_from_url(self, url: str) -> str:
        """
        URL에서 텍스트 추출
        
        Args:
            url: 추출할 URL
            
        Returns:
            추출된 텍스트
            
        Raises:
            requests.RequestException: 네트워크 오류
            ValueError: 잘못된 URL
        """
        try:
            # URL 검증
            parsed_url = urlparse(url)
            if not parsed_url.scheme or not parsed_url.netloc:
                raise ValueError(f"잘못된 URL 형식: {url}")
            
            # 요청
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            
            # HTML 파싱
            soup = BeautifulSoup(response.text, "html.parser")
            
            # 불필요한 태그 제거
            for tag in soup(['script', 'style', 'noscript', 'nav', 'footer', 'header']):
                tag.decompose()
            
            # 텍스트 추출
            text = " ".join(soup.stripped_strings)
            
            return text.strip()
            
        except requests.RequestException as e:
            raise Exception(f"URL 요청 중 오류 발생: {str(e)}")
        except Exception as e:
            raise Exception(f"텍스트 추출 중 오류 발생: {str(e)}")
    
    def extract_text_with_metadata(self, url: str) -> Dict[str, Any]:
        """
        메타데이터와 함께 텍스트 추출
        
        Args:
            url: 추출할 URL
            
        Returns:
            텍스트와 메타데이터
        """
        try:
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, "html.parser")
            
            # 메타데이터 추출
            title = soup.find('title')
            title_text = title.get_text().strip() if title else ""
            
            meta_description = soup.find('meta', attrs={'name': 'description'})
            description = meta_description.get('content', '') if meta_description else ""
            
            # 텍스트 추출
            for tag in soup(['script', 'style', 'noscript', 'nav', 'footer', 'header']):
                tag.decompose()
            
            text = " ".join(soup.stripped_strings)
            
            return {
                "url": url,
                "title": title_text,
                "description": description,
                "text": text.strip(),
                "length": len(text.strip()),
                "status_code": response.status_code
            }
            
        except Exception as e:
            raise Exception(f"메타데이터 추출 중 오류 발생: {str(e)}")
    
    def is_valid_url(self, url: str) -> bool:
        """URL 유효성 검사"""
        try:
            parsed_url = urlparse(url)
            return bool(parsed_url.scheme and parsed_url.netloc)
        except:
            return False
    
    def get_url_info(self, url: str) -> Dict[str, Any]:
        """URL 정보 반환"""
        parsed_url = urlparse(url)
        return {
            "scheme": parsed_url.scheme,
            "netloc": parsed_url.netloc,
            "path": parsed_url.path,
            "query": parsed_url.query,
            "fragment": parsed_url.fragment,
            "is_valid": self.is_valid_url(url)
        }


# 전역 인스턴스
url_loader = URLLoader()


# 편의 함수
def extract_text_from_url(url: str) -> str:
    """URL에서 텍스트 추출 편의 함수"""
    return url_loader.extract_text_from_url(url)