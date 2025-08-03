from fastapi import FastAPI

# 임시 SocketIO 앱
sio_app = FastAPI()

@sio_app.get("/")
def socket_root():
    return {"message": "SocketIO Server"} 