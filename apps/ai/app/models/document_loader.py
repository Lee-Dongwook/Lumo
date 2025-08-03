"""
Document Loader Model
문서 로딩 관련 모델
"""

from typing import List, Dict, Any
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain.schema import Document


class DocumentLoader:
    """문서 로더 클래스"""
    
    SUPPORTED_EXTENSIONS = {
        ".pdf": PyPDFLoader,
        ".docx": Docx2txtLoader,
        ".txt": TextLoader
    }
    
    @classmethod
    def load_documents(cls, path: str) -> List[Document]:
        """
        문서 로드
        
        Args:
            path: 문서 파일 경로
            
        Returns:
            로드된 문서 리스트
            
        Raises:
            ValueError: 지원하지 않는 파일 확장자
        """
        file_path = Path(path)
        ext = file_path.suffix.lower()
        
        if ext not in cls.SUPPORTED_EXTENSIONS:
            raise ValueError(f"지원하지 않는 파일 확장자: {ext}")
        
        try:
            loader_class = cls.SUPPORTED_EXTENSIONS[ext]
            
            if ext == ".txt":
                loader = loader_class(str(file_path), encoding="utf-8")
            else:
                loader = loader_class(str(file_path))
            
            return loader.load()
            
        except Exception as e:
            raise Exception(f"문서 로드 중 오류 발생: {str(e)}")
    
    @classmethod
    def get_supported_extensions(cls) -> List[str]:
        """지원하는 파일 확장자 목록 반환"""
        return list(cls.SUPPORTED_EXTENSIONS.keys())
    
    @classmethod
    def is_supported(cls, file_path: str) -> bool:
        """파일이 지원되는지 확인"""
        ext = Path(file_path).suffix.lower()
        return ext in cls.SUPPORTED_EXTENSIONS


# 편의 함수
def load_documents(path: str) -> List[Document]:
    """문서 로드 편의 함수"""
    return DocumentLoader.load_documents(path) 