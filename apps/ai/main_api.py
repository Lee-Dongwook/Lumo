from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from ai.api.routes import router
from ai.api.auth import router as auth_router
from ai.api.learning_schedule import router as learning_schedule_router
from ai.api.sockets.chat import router as chat_socket_router
from ai.socketio.server import sio_app
from ai.api import signaling_events


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, 'static')

app = FastAPI(
    title="My API",
    docs_url="/docs",
    redoc_url="/redoc"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(chat_socket_router)
app.include_router(auth_router)
app.include_router(learning_schedule_router)

app.mount('/ws', sio_app)
app.mount('/static', StaticFiles(directory=STATIC_DIR), name='static')

@app.get("/")
def root():
    return {"message": "Research Pipeline API is running"}