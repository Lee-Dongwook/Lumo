from fastapi import APIRouter, UploadFile, File, Form, Query
from supa.client import supabase, save_request
from pipelines.research_pipeline import run_research_pipeline
from inputs.url_loader import extract_text_from_url
from services.summarizer import summarize
from services.citation_finder import attach_citations
from flows.agent_loop import handle_call

router = APIRouter()

@router.get('/users')
async def get_users():
    res = supabase.table('users').select('*').execute()
    return res.data

@router.get('/requests')
async def get_requests(user_id:str = Query(...)):
    res = supabase.table('requests').select('*').eq('user_id',user_id).order('created_at',desc=True).execute()
    return {"requests": res.data}


@router.post("/analyze/file")
async def analyze_file(file: UploadFile = File(...), file_type: str = Form(...), user_id: str = Form(...)):
    path = f"/tmp/${file.filename}"
    with open(path, "wb") as f:
        f.write(await file.read())

    result = run_research_pipeline(path, file_type)
    save_request(user_id=user_id, request_type="file", content=result, source=file.filename) # type: ignore
    return {"result": result}


@router.post("/analyze/url")
async def analyze_url(url: str = Form(...),user_id: str = Form(...)):
    text = extract_text_from_url(url)
    summary = summarize(text)
    result = attach_citations(summary, text)

    save_request(user_id=user_id, request_type='url',content=result,source=url)
    return {"result": result}

@router.post('/call')
async def call_endpoint(file:UploadFile, user_id: str =Form(...)):
    file_path = f"/tmp/{file.filename}"
    with open(file_path, 'wb') as f:
        f.write(await file.read())

    audio_response = handle_call(file_path)    
    save_request(user_id=user_id, request_type="call", content="[voice response]", source=file.filename) # type: ignore
    
    return {
        "response_audio_base64": audio_response.encode("base64")   # type: ignore
    }
