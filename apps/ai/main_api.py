from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from api import auth
from api.sockets.chat import router as chat_socket_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(chat_socket_router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Research Pipeline API is running"}