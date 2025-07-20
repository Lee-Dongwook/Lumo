import os
from jose import jwt, JWTError
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.environ['JWT_SECRET']
ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
EXPIRE_MINUTES = int(os.environ.get('JWT_EXPIRE_MINUTES', 60 * 24* 7))

def create_access_token(data:dict, expires_delta: timedelta = None): # type: ignore
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None