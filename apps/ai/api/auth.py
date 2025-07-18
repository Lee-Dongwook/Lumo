from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, EmailStr, Field
from passlib.context import CryptContext
from datetime import datetime
from ai.services.email_service import send_verification_email
from ai.supa.client import supabase
import traceback

router = APIRouter(prefix='/api/auth', tags=['auth'])

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

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
        insert_res = supabase.table('users').insert({
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