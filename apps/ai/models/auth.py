from pydantic import BaseModel, EmailStr, Field

class SendCodeRequest(BaseModel):
    email:EmailStr
    

class VerifyCodeRequest(BaseModel):
    email:EmailStr
    code:str

class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)

class AgreementStatus(BaseModel):
    terms: bool = Field(..., description="이용약관 동의 여부")
    privacy: bool = Field(..., description="개인정보 수집 동의 여부")

class AgreementRequest(BaseModel):
    email: EmailStr
    agreement: AgreementStatus

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
