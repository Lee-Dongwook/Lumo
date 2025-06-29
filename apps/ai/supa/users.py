from supa.client import supabase

def ensure_user_exists(user_id:str, email:str):
    exists = supabase.table('users').select('id').eq('id',user_id).execute().data
    if not exists:
        supabase.table("users").insert({
            "id": user_id,
            "email": email
        }).execute()
