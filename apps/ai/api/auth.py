from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from ai.services.email_service import send_verification_email

router = APIRouter(prefix='/api/auth', tags=['auth'])

class SendCodeRequest(BaseModel):
    email:EmailStr

@router.post('/send-code')
async def send_code(req:SendCodeRequest):
    try:
       await send_verification_email(req.email)
       return {'message': "인증번호 전송 완료"}
    
    except Exception as e:
        import traceback
        print("[ERROR]", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")