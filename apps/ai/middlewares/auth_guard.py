from fastapi import Request, HTTPException, WebSocket, Depends
from starlette.status import HTTP_401_UNAUTHORIZED
from ai.utils.jwt_utils import decode_token

async def get_current_user(request: Request):
    auth = request.headers.get("authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Missing token")
    
    token = auth.split(" ")[1]
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid token")

    # 필요하다면 여기에 DB 조회 또는 사용자 존재 확인 로직 추가 가능
    return {
        "id": payload["sub"],
        "email": payload["email"]
    }

async def get_current_user_ws(websocket: WebSocket):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008)
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Missing token")
    
    payload = decode_token(token)
    if not payload:
        await websocket.close(code=1008)
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid token")

    return {
        "id": payload["sub"],
        "email": payload["email"]
    }
