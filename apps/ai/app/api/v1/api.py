from fastapi import APIRouter

from app.api.v1 import auth, chat, learning, research

api_router = APIRouter()

# 각 모듈의 라우터를 포함
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(learning.router, prefix="/learning", tags=["learning"])
api_router.include_router(research.router, prefix="/research", tags=["research"]) 