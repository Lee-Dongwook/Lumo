from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, EmailStr
from datetime import datetime
from ai.services.email_service import send_verification_email
from ai.supa.client import supabase

router = APIRouter(prefix='/api/auth', tags=['auth'])

class SendCodeRequest(BaseModel):
    email:EmailStr
    code: str

@router.post('/send-code')
async def send_code(req: SendCodeRequest):
    try:
       await send_verification_email(req.email)
       return {'message': "인증번호 전송 완료"}
    
    except Exception as e:
        import traceback
        print("[ERROR]", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    
@router.post('/verfiy-code')
async def verify_code(req: SendCodeRequest):
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