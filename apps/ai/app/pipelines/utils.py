"""
Pipeline Utilities
파이프라인 유틸리티 함수들
"""

import re
from typing import List, Dict, Any
from pathlib import Path


class TextProcessor:
    """텍스트 처리 클래스"""
    
    @staticmethod
    def split_text(text: str, max_chunk_size: int = 500) -> List[str]:
        """
        긴 텍스트를 문단이나 문장 단위로 분할
        
        Args:
            text: 분할할 텍스트
            max_chunk_size: 최대 청크 크기
            
        Returns:
            분할된 텍스트 청크 리스트
        """
        if not text.strip():
            return []
        
        # 문단으로 분할
        paragraphs = re.split(r"\n\s*\n", text)
        chunks = []

        for para in paragraphs:
            para = para.strip()
            if not para:
                continue
                
            if len(para) <= max_chunk_size:
                chunks.append(para)
            else:
                # 문장으로 추가 분할
                sentences = re.split(r'(?<=[.!?])\s+', para)
                chunk = ''
                
                for sent in sentences:
                    if len(chunk) + len(sent) <= max_chunk_size:
                        chunk += sent + " "
                    else:
                        if chunk.strip():
                            chunks.append(chunk.strip())
                        chunk = sent + " "

                if chunk.strip():
                    chunks.append(chunk.strip())
        
        return [c for c in chunks if c]
    
    @staticmethod
    def clean_text(text: str) -> str:
        """
        텍스트 정리 (불필요한 공백, 특수문자 제거)
        
        Args:
            text: 정리할 텍스트
            
        Returns:
            정리된 텍스트
        """
        # 연속된 공백 제거
        text = re.sub(r'\s+', ' ', text)
        # 앞뒤 공백 제거
        text = text.strip()
        return text
    
    @staticmethod
    def extract_sentences(text: str) -> List[str]:
        """
        텍스트에서 문장 추출
        
        Args:
            text: 문장을 추출할 텍스트
            
        Returns:
            문장 리스트
        """
        sentences = re.split(r'(?<=[.!?])\s+', text)
        return [s.strip() for s in sentences if s.strip()]
    
    @staticmethod
    def count_words(text: str) -> int:
        """단어 수 계산"""
        return len(text.split())
    
    @staticmethod
    def count_characters(text: str) -> int:
        """문자 수 계산 (공백 제외)"""
        return len(text.replace(" ", ""))


class FileProcessor:
    """파일 처리 클래스"""
    
    @staticmethod
    def get_file_info(file_path: str) -> Dict[str, Any]:
        """
        파일 정보 반환
        
        Args:
            file_path: 파일 경로
            
        Returns:
            파일 정보 딕셔너리
        """
        path = Path(file_path)
        
        if not path.exists():
            return {
                "exists": False,
                "error": "파일이 존재하지 않습니다."
            }
        
        return {
            "exists": True,
            "name": path.name,
            "extension": path.suffix.lower(),
            "size": path.stat().st_size,
            "size_mb": round(path.stat().st_size / (1024 * 1024), 2),
            "modified": path.stat().st_mtime
        }
    
    @staticmethod
    def validate_file_path(file_path: str) -> bool:
        """파일 경로 유효성 검사"""
        path = Path(file_path)
        return path.exists() and path.is_file()


# 편의 함수들
def split_text(text: str, max_chunk_size: int = 500) -> List[str]:
    """텍스트 분할 편의 함수"""
    return TextProcessor.split_text(text, max_chunk_size)


def clean_text(text: str) -> str:
    """텍스트 정리 편의 함수"""
    return TextProcessor.clean_text(text)


def get_file_info(file_path: str) -> Dict[str, Any]:
    """파일 정보 반환 편의 함수"""
    return FileProcessor.get_file_info(file_path)