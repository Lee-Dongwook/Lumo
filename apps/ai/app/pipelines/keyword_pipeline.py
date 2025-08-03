"""
Keyword Pipeline
키워드 기반 연구 파이프라인 모듈
"""

from typing import List, Dict, Any, Optional
from app.inputs.url_loader import URLLoader
from app.inputs.keyword_handler import KeywordHandler
from app.pipelines.utils import TextProcessor
# from app.services.url_crawler import google_search
# from app.services.summarizer import summarize
# from app.services.citation_finder import attach_citations


class KeywordPipeline:
    """키워드 파이프라인 클래스"""
    
    def __init__(self):
        self.url_loader = URLLoader()
        self.keyword_handler = KeywordHandler()
        self.text_processor = TextProcessor()
    
    def run_keyword_pipeline(
        self, 
        keyword: str, 
        num_results: int = 5,
        max_summary_length: int = 1000
    ) -> Dict[str, Any]:
        """
        키워드 기반 연구 파이프라인 실행:
        - 키워드로 웹 검색
        - URL에서 텍스트 추출
        - 텍스트 요약 및 인용
        
        Args:
            keyword: 검색할 키워드
            num_results: 검색 결과 수
            max_summary_length: 최대 요약 길이
            
        Returns:
            키워드 연구 결과
        """
        try:
            # 1. 키워드 검증
            if not keyword.strip():
                return {
                    "status": "error",
                    "message": "키워드가 비어있습니다.",
                    "keyword": keyword
                }
            
            # 2. 웹 검색 (임시 구현)
            urls = self._search_keyword(keyword, num_results)
            
            if not urls:
                return {
                    "status": "error",
                    "message": "검색 결과를 찾을 수 없습니다.",
                    "keyword": keyword
                }
            
            # 3. 텍스트 추출
            texts = []
            for url in urls:
                try:
                    text = self.url_loader.extract_text_from_url(url)
                    if text.strip():
                        texts.append((url, text))
                except Exception as e:
                    print(f"URL {url}에서 텍스트 추출 실패: {e}")
                    continue
            
            if not texts:
                return {
                    "status": "error",
                    "message": "추출된 텍스트가 없습니다.",
                    "keyword": keyword,
                    "urls": urls
                }
            
            # 4. 텍스트 결합 및 정리
            combined_text = "\n\n".join(text for _, text in texts)
            cleaned_text = self.text_processor.clean_text(combined_text)
            
            # 5. 키워드 추출
            keywords = self.keyword_handler.extract_keywords(cleaned_text)
            
            # 6. 요약 생성 (임시)
            summary = self._generate_summary(cleaned_text, max_summary_length)
            
            # 7. 인용 추가 (임시)
            summary_with_citations = self._add_citations(summary, cleaned_text)
            
            return {
                "status": "success",
                "keyword": keyword,
                "urls_searched": len(urls),
                "texts_extracted": len(texts),
                "total_text_length": len(cleaned_text),
                "extracted_keywords": keywords,
                "summary": summary_with_citations,
                "sources": [url for url, _ in texts],
                "processing_time": "N/A"  # TODO: 실제 처리 시간 측정
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": f"키워드 파이프라인 실행 중 오류: {str(e)}",
                "keyword": keyword
            }
    
    def _search_keyword(self, keyword: str, num_results: int) -> List[str]:
        """키워드 검색 (임시 구현)"""
        # TODO: 실제 Google 검색 구현
        # return google_search(keyword, num_results=num_results)
        
        # 임시로 더미 URL 반환
        return [
            f"https://example.com/search?q={keyword}",
            f"https://sample.org/research/{keyword}",
            f"https://test.net/article/{keyword}"
        ]
    
    def _generate_summary(self, text: str, max_length: int) -> str:
        """요약 생성 (임시 구현)"""
        # TODO: 실제 LLM 요약 구현
        # return summarize(text)
        
        sentences = self.text_processor.extract_sentences(text)
        if not sentences:
            return "요약할 내용이 없습니다."
        
        # 간단한 요약 (첫 3문장)
        summary_sentences = sentences[:3]
        summary = " ".join(summary_sentences)
        
        if len(summary) > max_length:
            summary = summary[:max_length] + "..."
        
        return summary
    
    def _add_citations(self, summary: str, original_text: str) -> str:
        """인용 추가 (임시 구현)"""
        # TODO: 실제 인용 시스템 구현
        # return attach_citations(summary, original_text)
        
        return f"{summary}\n\n[인용: 웹 검색 결과에서 추출]"


# 전역 파이프라인 인스턴스
keyword_pipeline = KeywordPipeline()


# 편의 함수
def run_keyword_pipeline(keyword: str, num_results: int = 5) -> Dict[str, Any]:
    """키워드 파이프라인 실행 편의 함수"""
    return keyword_pipeline.run_keyword_pipeline(keyword, num_results)