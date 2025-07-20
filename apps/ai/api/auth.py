from fastapi import APIRouter, HTTPException, Query, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, Field
from passlib.context import CryptContext
from datetime import datetime
from ai.services.email_service import send_verification_email
from ai.supa.client import supabase
from ai.utils.jwt_utils import create_access_token, decode_token
import traceback

router = APIRouter(prefix='/api/auth', tags=['auth'])

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/auth/login')

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


@router.post('/send-code')
async def send_code(req: SendCodeRequest):
    try:
       await send_verification_email(req.email)
       return {'message': "인증번호 전송 완료"}
    
    except Exception as e:
        import traceback
        print("[ERROR]", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    
@router.post('/verify-code')
async def verify_code(req: VerifyCodeRequest):
    now = datetime.utcnow()
    res = supabase.table('email_verification_codes').select('*').eq('email',req.email).eq('code',req.code).gte('expires_at', now.isoformat()).order('created_at', desc=True).limit(1).execute()

    data = res.data
    if not data:
        raise HTTPException(status_code=400, detail='유효하지 않거나 만료된 인증번호입니다.')
    
    return {'message': '인증 성공'}

@router.get('/check-email')
async def check_email(email:EmailStr = Query(...)):
    res = supabase.table('users').select('id').eq('email',email).limit(1).execute()

    if res.data and len(res.data) > 0:
        return {"exists": True}
    
    return {'exists': False}

@router.post('/signup')
async def signup(req:SignupRequest):
    res = supabase.table('users').select('id').eq('email',req.email).limit(1).execute()
    if res.data and len(res.data) > 0:
        raise HTTPException(status_code=400, detail='이미 가입된 이메일입니다.')
    
    hashed_password = pwd_context.hash(req.password)

    try:
       supabase.table('users').insert({
            'email':req.email,
            'password': hashed_password,
            'created_at': datetime.utcnow().isoformat()
        }).execute()
    except Exception as e:
        traceback.print_exc() 
        raise HTTPException(status_code=500, detail=f"회원가입 실패: {str(e)}")

    return {'message':'회원가입 완료'}

@router.put('/agreement')
async def update_agreement(req:AgreementRequest):
    try:
        check = supabase.table('users').select('id').eq('email',req.email).limit(1).execute()
        if not check.data:
            raise HTTPException(status_code=404, detail='사용자를 찾을 수 없습니다.')

        update_data = {
            'agreement': req.agreement.model_dump(),
            'updated_at': datetime.utcnow().isoformat()
        }

        update_res = supabase.table('users').update(update_data).eq('email', req.email).execute()

        if update_res.error:
            raise HTTPException(status_code=500, detail=f"약관 동의 업데이트 실패: {update_res.error.message}")
        
        return {'message': '약관 동의 상태가 업데이트되었습니다.'}

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"약관 동의 업데이트 실패: {str(e)}")
    
@router.post('/login')
async def login(req: LoginRequest):
    res = supabase.table("users").select("*").eq("email", req.email).single().execute()
    if not res.data:
        raise HTTPException(status_code=401, detail="이메일이 존재하지 않습니다.")
    
    user = res.data
    if not pwd_context.verify(req.password, user["password"]):
        raise HTTPException(status_code=401, detail="비밀번호가 일치하지 않습니다.")

    token = create_access_token(data={"sub": user["id"], "email": user["email"]})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user["id"], "email": user["email"]}
    }


@router.get("/me")
async def get_me(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="유효하지 않은 토큰입니다.")
    return {"user": payload}