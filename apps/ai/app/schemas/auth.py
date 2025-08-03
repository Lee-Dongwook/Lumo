"""
Authentication Schemas
인증 관련 Pydantic 스키마
"""

from pydantic import BaseModel, EmailStr, Field


class SendCodeRequest(BaseModel):
    """인증 코드 발송 요청"""
    email: EmailStr


class VerifyCodeRequest(BaseModel):
    """인증 코드 검증 요청"""
    email: EmailStr
    code: str


class SignupRequest(BaseModel):
    """회원가입 요청"""
    email: EmailStr
    password: str = Field(min_length=8, description="최소 8자 이상")


class AgreementStatus(BaseModel):
    """약관 동의 상태"""
    terms: bool = Field(..., description="이용약관 동의 여부")
    privacy: bool = Field(..., description="개인정보 수집 동의 여부")


class AgreementRequest(BaseModel):
    """약관 동의 요청"""
    email: EmailStr
    agreement: AgreementStatus


class LoginRequest(BaseModel):
    """로그인 요청"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """토큰 응답"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class UserResponse(BaseModel):
    """사용자 정보 응답"""
    id: str
    email: str
    created_at: str 