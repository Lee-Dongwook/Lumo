from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from services.email_service import send_verification_email

router = APIRouter(prefix='/auth', tags=['auth'])

class SendCodeRequest(BaseModel):
    email:EmailStr

@router.post('/send-code')
async def send_code(req:SendCodeRequest):
    try:
       await send_verification_email(req.email)
       return {'message': "인증번호 전송 완료"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))