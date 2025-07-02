import random
import string
import httpx
from datetime import datetime, timedelta
from ai.config.settings import RESEND_API_KEY
from ai.supa.client import supabase

def generate_code(length=6) -> str:
    return ''.join(random.choices(string.digits, k=length))

def get_verification_email_html(code: str) -> str:
    return f"""
    <html lang="ko">
      <body style="background-color: #f4f4f4; padding: 40px; font-family: sans-serif;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 32px; border-radius: 8px;">
          <p style="background-color: #a273f3; color: white; padding: 8px 16px; border-radius: 6px; width: fit-content;">
            이메일 양식
          </p>
          <h2 style="margin-top: 24px;">제목: [Lumo] 회원가입 인증번호</h2>
          <h3>Odyssey 이메일 인증 안내</h3>

          <p style="margin-top: 24px;">
            안녕하세요, 고객님<br/>
            회원가입을 위해 이메일 인증을 진행합니다.<br/>
            아래 발급된 이메일 인증번호를 입력하여 인증을 완료해주세요.<br/>
            개인정보 보호를 위해 인증번호는 <strong>10분 간 유효</strong>합니다.
          </p>

          <hr style="margin: 32px 0;" />

          <p style="font-size: 18px;">
            <strong>인증번호: {code}</strong>
          </p>

          <hr style="margin: 32px 0;" />

          <p style="font-size: 12px; color: gray;">
            본 메일은 발신 전용입니다. 궁금하신 사항은 아래 이메일로 문의해주시기 바랍니다.<br/>
            이메일: #####@######.###
          </p>
        </div>
      </body>
    </html>
    """


async def send_email_html(to:str, subject:str, html:str):
    if not RESEND_API_KEY:
        raise Exception("RESEND_API_KEY 환경변수가 없습니다.")
    
    async with httpx.AsyncClient() as client:
        res = await client.post(
            'https//api.resend.com/emails',
            headers={
                'Authorization': f"Bearer {RESEND_API_KEY}",
                'Content-Type': 'application/json'
            },
            json={
                "from": "Lumo <no-reply@lumo.com>",
                "to": [to],
                "subject": subject,
                "html": html
            }
        )
        if res.status_code >=400:
            raise Exception(f"이메일 전송 실패: {res.text}")



async def send_verification_email(email:str):
    code = generate_code()
    expires_at = datetime.utcnow() + timedelta(minutes=10)

    supabase.table('email_verification_codes').insert({
        'email':email,
        'code': code,
        'expries_at': expires_at.isoformat()
    }).execute()
    
    subject = '[Lumo] 회원가입 인증번호'
    html = get_verification_email_html(code)

    await send_email_html(to=email, subject=subject, html=html)

    print(f"[DEBUG] {email} 에게 인증번호 전송: {code}")