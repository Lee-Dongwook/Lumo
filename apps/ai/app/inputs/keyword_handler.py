"""
Keyword Handler
키워드 추출 및 처리 모듈
"""

from typing import List, Dict, Any
from app.models.llm import llm_client


class KeywordHandler:
    """키워드 처리 클래스"""
    
    KEYWORD_PROMPT = """
다음 내용에서 5-7개의 주요 주제나 키워드를 추출하세요. 쉼표로 구분된 목록으로 반환해주세요.

{text}
"""
    
    @classmethod
    def extract_keywords(cls, text: str, max_keywords: int = 7) -> List[str]:
        """
        텍스트에서 키워드 추출
        
        Args:
            text: 분석할 텍스트
            max_keywords: 최대 키워드 수
            
        Returns:
            추출된 키워드 리스트
        """
        try:
            prompt = cls.KEYWORD_PROMPT.format(text=text)
            response = llm_client.call_llm(
                prompt=prompt,
                temperature=0.3,  # 키워드 추출은 낮은 창의성
                max_tokens=200
            )
            
            # 응답 파싱
            keywords = [kw.strip() for kw in response.split(",") if kw.strip()]
            
            # 최대 개수 제한
            return keywords[:max_keywords]
            
        except Exception as e:
            raise Exception(f"키워드 추출 중 오류 발생: {str(e)}")
    
    @classmethod
    def extract_keywords_with_confidence(cls, text: str) -> List[Dict[str, Any]]:
        """
        신뢰도와 함께 키워드 추출
        
        Args:
            text: 분석할 텍스트
            
        Returns:
            키워드와 신뢰도 정보
        """
        keywords = cls.extract_keywords(text)
        
        # 간단한 신뢰도 계산 (텍스트에서 키워드 출현 빈도 기반)
        result = []
        text_lower = text.lower()
        
        for keyword in keywords:
            keyword_lower = keyword.lower()
            frequency = text_lower.count(keyword_lower)
            confidence = min(frequency / len(text.split()), 1.0)  # 간단한 신뢰도
            
            result.append({
                "keyword": keyword,
                "confidence": round(confidence, 3),
                "frequency": frequency
            })
        
        # 신뢰도 순으로 정렬
        result.sort(key=lambda x: x["confidence"], reverse=True)
        return result
    
    @classmethod
    def categorize_keywords(cls, keywords: List[str]) -> Dict[str, List[str]]:
        """
        키워드를 카테고리별로 분류
        
        Args:
            keywords: 키워드 리스트
            
        Returns:
            카테고리별 키워드
        """
        categories = {
            "technical": [],
            "business": [],
            "general": []
        }
        
        # 간단한 카테고리 분류 (실제로는 더 정교한 분류 필요)
        for keyword in keywords:
            keyword_lower = keyword.lower()
            
            if any(tech in keyword_lower for tech in ["api", "code", "tech", "system", "data"]):
                categories["technical"].append(keyword)
            elif any(biz in keyword_lower for biz in ["business", "market", "customer", "product", "service"]):
                categories["business"].append(keyword)
            else:
                categories["general"].append(keyword)
        
        return categories


# 편의 함수
def extract_keywords(text: str) -> List[str]:
    """키워드 추출 편의 함수"""
    return KeywordHandler.extract_keywords(text)

