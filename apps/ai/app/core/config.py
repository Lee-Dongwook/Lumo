"""
Application Configuration
앱의 모든 설정을 관리하는 모듈
"""

import os
from typing import Optional
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    """애플리케이션 설정"""
    
    # Project Info
    PROJECT_NAME: str = "Lumo AI"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "AI-powered learning and research platform"
    API_V1_STR: str = "/api/v1"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    
    # CORS
    ALLOWED_HOSTS: list = ["*"]
    
    # OpenAI
    OPENAI_API_KEY: Optional[str] = None
    DEFAULT_MODEL: str = "gpt-3.5-turbo"
    
    # Supabase
    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None
    SUPABASE_SERVICE_KEY: Optional[str] = None
    
    # JWT
    JWT_SECRET: Optional[str] = None
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Email
    RESEND_API_KEY: Optional[str] = None
    
    # AWS (TODO: 구현 예정)
    AWS_ACCESS_KEY: str = ""
    AWS_SECRET_KEY: str = ""
    AWS_REGION: str = ""
    S3_BUCKET: str = ""
    
    # Database
    DATABASE_URL: Optional[str] = None
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Monitoring
    ENABLE_METRICS: bool = True
    METRICS_PORT: int = 9090
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # 추가 환경변수 무시


# 전역 설정 인스턴스
settings = Settings() 