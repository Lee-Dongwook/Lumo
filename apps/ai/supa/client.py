from supabase import create_client
from config.settings import SUPABASE_URL, SUPABASE_SERVICE_KEY

supabase = create_client(SUPABASE_URL , SUPABASE_SERVICE_KEY) # type: ignore

def save_request(user_id:str, request_type:str, content:str, source:str):
    return supabase.table("requests").insert({
        "user_id": user_id,
        "request_type": request_type,
        "content": content,
        "source": source
    }).execute()