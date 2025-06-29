from fastapi import Request, HTTPException, Depends
from supa.auth import decode_user
from supa.users import ensure_user_exists

async def get_current_user(request: Request):
     auth = request.headers.get("authorization")
     if not auth or not auth.startswith("Bearer "):
          raise HTTPException(status_code=401, detail="Missing token")
     
     token = auth.split(" ")[1]
     user = decode_user(token)
     if not user:
          raise HTTPException(status_code=401, detail="Invalid token")
     
     ensure_user_exists(user["id"], user['email'])
     return user