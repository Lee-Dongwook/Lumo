import pytest
from datetime import timedelta
from unittest.mock import patch

from ..core.settings import settings
from ..core.auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_token,
    create_user_token,
    verify_token,
    TokenData
)
from ..middlewares.auth import (
    get_current_user,
    get_current_user_optional,
    UserContext,
    AuthError
)

class TestSettings:
    def test_settings_loaded(self):
        """설정이 올바르게 로드되는지 테스트"""
        assert settings.jwt_secret is not None
        assert settings.jwt_algorithm == "HS256"
        assert settings.jwt_expire_minutes > 0

class TestAuth:
    def test_password_hashing(self):
        """비밀번호 해싱 및 검증 테스트"""
        password = "test_password"
        hashed = hash_password(password)
        
        assert hashed != password
        assert verify_password(password, hashed) is True
        assert verify_password("wrong_password", hashed) is False
    
    def test_token_creation_and_verification(self):
        """토큰 생성 및 검증 테스트"""
        user_id = "test_user"
        email = "test@example.com"
        
        # 토큰 생성
        token_response = create_user_token(user_id, email)
        assert token_response.access_token is not None
        assert token_response.token_type == "bearer"
        assert token_response.expires_in > 0
        
        # 토큰 검증
        token_data = verify_token(token_response.access_token)
        assert token_data is not None
        assert token_data.sub == user_id
        assert token_data.email == email
    
    def test_invalid_token(self):
        """잘못된 토큰 처리 테스트"""
        invalid_token = "invalid.token.here"
        token_data = verify_token(invalid_token)
        assert token_data is None
    
    def test_token_with_custom_expiry(self):
        """커스텀 만료 시간으로 토큰 생성 테스트"""
        data = {"sub": "test_user", "email": "test@example.com"}
        custom_expiry = timedelta(hours=1)
        
        token = create_access_token(data, expires_delta=custom_expiry)
        assert token is not None
        
        # 토큰 디코딩
        payload = decode_token(token)
        assert payload is not None
        assert payload["sub"] == "test_user"
        assert payload["email"] == "test@example.com"

class TestMiddleware:
    @pytest.mark.asyncio
    async def test_auth_error_creation(self):
        """AuthError 생성 테스트"""
        error = AuthError("Custom error message")
        assert error.status_code == 401
        assert error.detail == "Custom error message"
        assert "WWW-Authenticate" in error.headers
    
    def test_user_context_creation(self):
        """UserContext 생성 테스트"""
        token_data = TokenData(sub="test_user", email="test@example.com")
        user_context = UserContext(
            id="test_user",
            email="test@example.com",
            token_data=token_data
        )
        
        assert user_context.id == "test_user"
        assert user_context.email == "test@example.com"
        assert user_context.token_data == token_data

# Integration tests
class TestIntegration:
    def test_full_auth_flow(self):
        """전체 인증 플로우 테스트"""
        # 1. 사용자 토큰 생성
        user_id = "integration_test_user"
        email = "integration@example.com"
        token_response = create_user_token(user_id, email)
        
        # 2. 토큰 검증
        token_data = verify_token(token_response.access_token)
        assert token_data is not None
        assert token_data.sub == user_id
        assert token_data.email == email
        
        # 3. UserContext 생성
        user_context = UserContext(
            id=token_data.sub,
            email=token_data.email,
            token_data=token_data
        )
        assert user_context.id == user_id
        assert user_context.email == email 