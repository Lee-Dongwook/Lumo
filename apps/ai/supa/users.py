from ai.supa.client import supabase

def ensure_user_exists(user_id:str, email:str):
  res = supabase.table('users').select('*').eq('id','user_id').execute()
  if res.data and len(res.data) > 0:
    return
  
  supabase.table('users').insert({
    'id':user_id,
    'email':email
  }).execute()
