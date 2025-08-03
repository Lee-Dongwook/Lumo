from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.api.v1.api import api_router
from app.socketio.server import sio_app

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, 'static')

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.DESCRIPTION,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 라우터 등록
app.include_router(api_router, prefix=settings.API_V1_STR)

# WebSocket 앱 마운트
app.mount('/ws', sio_app)

# 정적 파일 서빙
app.mount('/static', StaticFiles(directory=STATIC_DIR), name='static')

@app.get("/")
def root():
    return {"message": f"{settings.PROJECT_NAME} API is running", "version": settings.VERSION}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "lumo-ai"} 