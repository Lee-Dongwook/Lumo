"""
File Loader
파일 로딩 및 텍스트 추출 모듈
"""

from typing import Dict, Any, Optional
from pathlib import Path
from app.services.extractor import extract_key_information


class FileLoader:
    """파일 로더 클래스"""
    
    SUPPORTED_TYPES = {"pdf", "docx", "txt"}
    
    @classmethod
    def load_file_and_extract(cls, path: str) -> str:
        """
        파일 타입을 확장자로 판단하고 텍스트 추출
        
        Args:
            path: 파일 경로
            
        Returns:
            추출된 텍스트
            
        Raises:
            ValueError: 지원하지 않는 파일 타입
        """
        file_path = Path(path)
        ext = file_path.suffix.lower().lstrip('.')
        
        if ext not in cls.SUPPORTED_TYPES:
            raise ValueError(f"지원하지 않는 파일 타입: {ext}")
        
        try:
            # TODO: extract_text 함수 구현 후 활성화
            # return extract_text(str(file_path), ext)
            return f"Extracted text from {path} ({ext} file)"
        except Exception as e:
            raise Exception(f"파일 로드 중 오류 발생: {str(e)}")
    
    @classmethod
    def get_supported_types(cls) -> set[str]:
        """지원하는 파일 타입 목록 반환"""
        return cls.SUPPORTED_TYPES.copy()
    
    @classmethod
    def is_supported(cls, file_path: str) -> bool:
        """파일이 지원되는지 확인"""
        ext = Path(file_path).suffix.lower().lstrip('.')
        return ext in cls.SUPPORTED_TYPES
    
    @classmethod
    def get_file_info(cls, file_path: str) -> Dict[str, Any]:
        """파일 정보 반환"""
        path = Path(file_path)
        return {
            "name": path.name,
            "extension": path.suffix.lower().lstrip('.'),
            "size": path.stat().st_size if path.exists() else 0,
            "is_supported": cls.is_supported(file_path)
        }


# 편의 함수
def load_file_and_extract(path: str) -> str:
    """파일 로드 및 텍스트 추출 편의 함수"""
    return FileLoader.load_file_and_extract(path)