import jwt
from fastapi import HTTPException
from config.settings import JWT_SECRET
from starlette.status import HTTP_401_UNAUTHORIZED


def decode_user(token:str):
    try:
       payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"]) # type: ignore

       return {
         "id": payload['sub'],
         "email": payload['email']
       }
    
    except jwt.ExpiredSignatureError:
      raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Token expired")
    
    except jwt.InvalidTokenError:
      raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid token")