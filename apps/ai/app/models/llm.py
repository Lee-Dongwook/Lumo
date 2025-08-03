"""
LLM Model
LLM 관련 모델 및 클라이언트
"""

import os
from typing import List, Dict, Any, Optional
from openai import OpenAI
from app.core.config import settings


class LLMClient:
    """LLM 클라이언트"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.client = OpenAI(api_key=api_key or settings.OPENAI_API_KEY)
    
    def call_llm(
        self, 
        prompt: str, 
        model: str = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
        system_prompt: str = "You are an expert research assistant."
    ) -> str:
        """
        LLM 호출
        
        Args:
            prompt: 사용자 프롬프트
            model: 사용할 모델
            temperature: 창의성 (0-1)
            max_tokens: 최대 토큰 수
            system_prompt: 시스템 프롬프트
            
        Returns:
            LLM 응답
        """
        try:
            response = self.client.chat.completions.create(
                model=model or settings.DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=temperature,
                max_tokens=max_tokens
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            raise Exception(f"LLM 호출 중 오류 발생: {str(e)}")
    
    def call_llm_stream(
        self,
        prompt: str,
        model: str = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
        system_prompt: str = "You are an expert research assistant."
    ):
        """
        스트리밍 LLM 호출
        
        Args:
            prompt: 사용자 프롬프트
            model: 사용할 모델
            temperature: 창의성 (0-1)
            max_tokens: 최대 토큰 수
            system_prompt: 시스템 프롬프트
            
        Yields:
            스트리밍 응답 청크
        """
        try:
            response = self.client.chat.completions.create(
                model=model or settings.DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True
            )
            
            for chunk in response:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
                    
        except Exception as e:
            raise Exception(f"스트리밍 LLM 호출 중 오류 발생: {str(e)}")


# 전역 LLM 클라이언트 인스턴스
llm_client = LLMClient() 