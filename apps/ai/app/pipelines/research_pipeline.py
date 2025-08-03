"""
Research Pipeline
연구 파이프라인 모듈
"""

from typing import Dict, Any, Optional
from app.inputs.file_loader import FileLoader
from app.inputs.url_loader import URLLoader
from app.pipelines.utils import TextProcessor
# from app.services.extractor import extract_text
# from app.services.summarizer import summarize
# from app.services.citation_finder import attach_citations


class ResearchPipeline:
    """연구 파이프라인 클래스"""
    
    def __init__(self):
        self.file_loader = FileLoader()
        self.url_loader = URLLoader()
        self.text_processor = TextProcessor()
    
    def run_research_pipeline(
        self, 
        input_path: str, 
        input_type: str,
        max_summary_length: int = 1000
    ) -> Dict[str, Any]:
        """
        End-to-end 연구 파이프라인 실행:
        - 파일에서 텍스트 추출
        - LLM을 사용한 내용 요약
        - 인용을 위한 소스 문장 첨부
        
        Args:
            input_path: 입력 파일 경로 또는 URL
            input_type: 입력 타입 ('file' 또는 'url')
            max_summary_length: 최대 요약 길이
            
        Returns:
            연구 결과 딕셔너리
        """
        try:
            # 1. 텍스트 추출
            if input_type == 'url':
                text = self.url_loader.extract_text_from_url(input_path)
            else:
                text = self.file_loader.load_file_and_extract(input_path)
            
            if not text.strip():
                return {
                    "status": "error",
                    "message": "입력에서 텍스트를 추출할 수 없습니다.",
                    "input_path": input_path,
                    "input_type": input_type
                }
            
            # 2. 텍스트 정리
            cleaned_text = self.text_processor.clean_text(text)
            
            # 3. 텍스트 분석
            analysis = self._analyze_text(cleaned_text)
            
            # 4. 요약 생성 (임시)
            summary = self._generate_summary(cleaned_text, max_summary_length)
            
            # 5. 인용 추가 (임시)
            summary_with_citations = self._add_citations(summary, cleaned_text)
            
            return {
                "status": "success",
                "input_path": input_path,
                "input_type": input_type,
                "text_length": len(cleaned_text),
                "word_count": self.text_processor.count_words(cleaned_text),
                "analysis": analysis,
                "summary": summary_with_citations,
                "processing_time": "N/A"  # TODO: 실제 처리 시간 측정
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": f"연구 파이프라인 실행 중 오류: {str(e)}",
                "input_path": input_path,
                "input_type": input_type
            }
    
    def _analyze_text(self, text: str) -> Dict[str, Any]:
        """텍스트 분석"""
        sentences = self.text_processor.extract_sentences(text)
        chunks = self.text_processor.split_text(text)
        
        return {
            "sentences_count": len(sentences),
            "chunks_count": len(chunks),
            "average_sentence_length": sum(len(s) for s in sentences) / len(sentences) if sentences else 0,
            "average_chunk_length": sum(len(c) for c in chunks) / len(chunks) if chunks else 0
        }
    
    def _generate_summary(self, text: str, max_length: int) -> str:
        """요약 생성 (임시 구현)"""
        # TODO: 실제 LLM 요약 구현
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
        return f"{summary}\n\n[인용: 원본 텍스트에서 추출]"


# 전역 파이프라인 인스턴스
research_pipeline = ResearchPipeline()


# 편의 함수
def run_research_pipeline(input_path: str, input_type: str) -> str:
    """연구 파이프라인 실행 편의 함수"""
    result = research_pipeline.run_research_pipeline(input_path, input_type)
    
    if result["status"] == "success":
        return result["summary"]
    else:
        return result["message"]