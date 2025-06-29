from supa.client import supabase
from supabase import create_client, Client
from config.settings import JWT_SECRET
import jwt
import os

def decode_user(token:str):
    try:
       payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"]) # type: ignore

       return {
         "id": payload['sub'],
         "email": payload.get('email')
       }
    
    except Exception:
      return None