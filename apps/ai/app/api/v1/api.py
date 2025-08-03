from fastapi import APIRouter

from app.api.v1 import auth, chat, learning, research, routes

api_router = APIRouter()

# 각 모듈의 라우터를 포함
api_router.include_router(auth.router, tags=["authentication"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(learning.router, tags=["learning"])
api_router.include_router(research.router, prefix="/research", tags=["research"])
api_router.include_router(routes.router, tags=["routes"]) 