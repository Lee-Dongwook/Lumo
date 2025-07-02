from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ai.api.routes import router
from ai.api.auth import router as auth_router
from ai.api.sockets.chat import router as chat_socket_router

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

@app.get("/")
def root():
    return {"message": "Research Pipeline API is running"}