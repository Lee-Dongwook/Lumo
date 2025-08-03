# AI 모듈 마이그레이션 가이드

이 가이드는 기존 코드를 새로운 `ai/core`와 `ai/middlewares` 구조로 마이그레이션하는 방법을 설명합니다.

## 주요 변경사항

### 1. 설정 관리 통합

**이전:**

```python
from ai.core.config import settings
# 또는
from ai.utils.jwt_utils import SECRET_KEY, ALGORITHM
```

**이후:**

```python
from ai.core.settings import settings

# JWT 설정
settings.jwt_secret
settings.jwt_algorithm
settings.jwt_expire_minutes

# AI 모델 설정
settings.openai_api_key
settings.anthropic_api_key

# 오디오 설정
settings.audio_sample_rate
settings.audio_channels
```

### 2. 인증 함수 통합

**이전:**

```python
from ai.core.security import create_access_token, decode_token
# 또는
from ai.utils.jwt_utils import create_access_token, decode_token
```

**이후:**

```python
from ai.core.auth import (
    create_access_token,
    decode_token,
    create_user_token,
    verify_token,
    TokenData,
    TokenResponse
)

# 새로운 함수들
token_response = create_user_token("user_id", "email")
token_data = verify_token(token)
```

### 3. 미들웨어 개선

**이전:**

```python
from ai.middlewares.auth_guard import get_current_user, get_current_user_ws
```

**이후:**

```python
from ai.middlewares.auth import (
    get_current_user,
    get_current_user_optional,
    get_current_user_ws,
    require_auth,
    optional_auth,
    UserContext
)

# 타입 안전한 사용자 컨텍스트
@app.get("/protected")
async def protected_endpoint(user: UserContext = Depends(require_auth())):
    return {"user_id": user.id, "email": user.email}
```

## 단계별 마이그레이션

### 1단계: 임포트 업데이트

모든 파일에서 임포트를 새로운 구조로 변경:

```python
# 이전
from ai.core.config import settings
from ai.core.security import create_access_token
from ai.middlewares.auth_guard import get_current_user

# 이후
from ai.core.settings import settings
from ai.core.auth import create_access_token
from ai.middlewares.auth import get_current_user
```

### 2단계: 설정 사용법 업데이트

```python
# 이전
JWT_SECRET = settings.JWT_SECRET

# 이후
jwt_secret = settings.jwt_secret
```

### 3단계: 인증 로직 업데이트

```python
# 이전
token = create_access_token({"sub": user_id, "email": email})
payload = decode_token(token)

# 이후
token_response = create_user_token(user_id, email)
token_data = verify_token(token_response.access_token)
```

### 4단계: 미들웨어 사용법 업데이트

```python
# 이전
@app.get("/protected")
async def endpoint(request: Request):
    user = await get_current_user(request)
    return {"user": user}

# 이후
@app.get("/protected")
async def endpoint(user: UserContext = Depends(require_auth())):
    return {"user_id": user.id, "email": user.email}
```

## 호환성

기존 파일들은 하위 호환성을 위해 유지되며, 새로운 함수들을 다시 내보냅니다:

- `ai/core/config.py` → `ai/core/settings.py` 사용 권장
- `ai/core/security.py` → `ai/core/auth.py` 사용 권장
- `ai/middlewares/auth_guard.py` → `ai/middlewares/auth.py` 사용 권장
- `ai/utils/jwt_utils.py` → `ai/core/auth.py` 사용 권장

## 테스트

마이그레이션 후 다음 명령으로 테스트를 실행하세요:

```bash
cd apps/ai
pytest tests/test_core.py -v
```

## 환경 변수 업데이트

`.env` 파일에 새로운 설정을 추가하세요:

```env
# 기존 설정
JWT_SECRET=your-secret-key

# 새로운 설정 (선택사항)
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=10080
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
AUDIO_SAMPLE_RATE=16000
AUDIO_CHANNELS=1
LOG_LEVEL=INFO
```
