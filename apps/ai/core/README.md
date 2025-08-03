# AI Core Module

이 모듈은 AI 애플리케이션의 핵심 기능을 제공합니다.

## 설정 관리 (Settings)

```python
from ai.core.settings import settings

# JWT 설정
print(settings.jwt_secret)
print(settings.jwt_expire_minutes)

# AI 모델 설정
print(settings.openai_api_key)

# 오디오 설정
print(settings.audio_sample_rate)
```

## 인증 유틸리티 (Auth)

```python
from ai.core.auth import (
    hash_password,
    verify_password,
    create_user_token,
    verify_token,
    TokenData
)

# 비밀번호 해싱
hashed = hash_password("my_password")
is_valid = verify_password("my_password", hashed)

# 토큰 생성
token_response = create_user_token("user123", "user@example.com")
print(token_response.access_token)

# 토큰 검증
token_data = verify_token(token_response.access_token)
if token_data:
    print(f"User: {token_data.sub}")
    print(f"Email: {token_data.email}")
```

## 미들웨어 사용법

```python
from fastapi import Depends
from ai.middlewares.auth import (
    get_current_user,
    get_current_user_optional,
    require_auth,
    UserContext
)

# 인증이 필요한 엔드포인트
@app.get("/protected")
async def protected_endpoint(user: UserContext = Depends(require_auth())):
    return {"message": f"Hello {user.email}"}

# 선택적 인증 엔드포인트
@app.get("/optional")
async def optional_endpoint(user: UserContext = Depends(get_current_user_optional)):
    if user:
        return {"message": f"Hello {user.email}"}
    return {"message": "Hello anonymous user"}

# WebSocket 인증
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    user = await get_current_user_ws(websocket)
    # WebSocket 로직...
```

## 환경 변수

`.env` 파일에 다음 설정을 추가하세요:

```env
# JWT 설정
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=10080

# AI 모델 설정
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# 데이터베이스 설정
DATABASE_URL=your-database-url

# 외부 서비스
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key

# 오디오 설정
AUDIO_SAMPLE_RATE=16000
AUDIO_CHANNELS=1

# 로깅
LOG_LEVEL=INFO
``` 