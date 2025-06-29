from config.settings import SUPABASE_URL, SUPABASE_SERVICE_KEY
from supabase import create_client
from datetime import datetime
import traceback

supabase = create_client(SUPABASE_URL , SUPABASE_SERVICE_KEY) # type: ignore

def save_request(*, user_id:str, request_type:str, content:dict, response_audio_url: str | None = None , source:str, status:str = 'completed'):
    try:
        title = None
        if isinstance(content, dict):
            title = content.get('summary') or content.get('response')
            if title:
                title = title.strip()[:30] + "..."
        
        data = {
            "user_id":user_id,
            "request_type": request_type,
            "source": source,
            "content": content,
            "status": status,
            "title": title,
            "created_at": datetime.utcnow().isoformat()
        }

        if response_audio_url:
            data["response_audio_url"] = response_audio_url

        supabase.table("requests").insert(data).execute()

    except Exception as e:
        supabase.table('request_errors').insert({
            "user_id": user_id,
            "error_message": str(e),
            "traceback": traceback.format_exc(),
            "source": source,
            "request_type": request_type,
            "created_at": datetime.utcnow().isoformat()
        }).execute()