from supabase import create_client
from config.settings import SUPABASE_URL, SUPABASE_ANON_KEY

supabase = create_client(SUPABASE_URL , SUPABASE_ANON_KEY) # type: ignore