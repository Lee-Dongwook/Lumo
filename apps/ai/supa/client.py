from supabase import create_client
from config.settings import SUPABASE_URL, SUPABASE_SERVICE_KEY

supabase = create_client(SUPABASE_URL , SUPABASE_SERVICE_KEY) # type: ignore