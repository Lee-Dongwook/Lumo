from fastapi import APIRouter, UploadFile, File, Form, Depends
from supa.client import supabase, save_request
from supa.storage import upload_audio
from pipelines.research_pipeline import run_research_pipeline
from inputs.url_loader import extract_text_from_url
from services.summarizer import summarize
from services.citation_finder import attach_citations
from pipelines.keyword_pipeline import run_keyword_pipeline
from flows.agent_loop import handle_call
from middlewares.auth_guard import get_current_user
import base64

router = APIRouter(
    prefix='/api'
)

@router.get('/users')
async def get_users():
    res = supabase.table('users').select('*').execute()
    return res.data

@router.get("/me")
async def get_me(user=Depends(get_current_user)):
    return {"id": user["id"], "email": user["email"]}

@router.get('/requests')
async def get_requests(user=Depends(get_current_user)):
    res = supabase.table('requests').select('*').eq('user_id',user["id"]).order('created_at',desc=True).execute()
    return {"requests": res.data}


@router.post("/analyze/file")
async def analyze_file(file: UploadFile = File(...), file_type: str = Form(...), user=Depends(get_current_user)):
    path = f"/tmp/${file.filename}"
    with open(path, "wb") as f:
        f.write(await file.read())

    result = run_research_pipeline(path, file_type)

    save_request(user_id=user["id"], request_type="file", content=result, source=file.filename) # type: ignore
    return {"result": result}


@router.post("/analyze/url")
async def analyze_url(url: str = Form(...), user=Depends(get_current_user)):
    text = extract_text_from_url(url)
    summary = summarize(text)
    result = attach_citations(summary, text)

    if isinstance(result, str):
        result = {"summary": result }

    save_request(user_id=user["id"], request_type='url',content=result, source=url)
    return {"result": result}

@router.post('/analyze/keyword')
async def analyze_keyword(keyword:str = Form(...), user=Depends(get_current_user)):
    result = run_keyword_pipeline(keyword)

    save_request(
        user_id= user['id'],
        request_type="keyword",
        content=result,
        source=keyword
    )
    return {"result": result}

@router.post('/call')
async def call_endpoint(file:UploadFile, user=Depends(get_current_user)):
    file_path = f"/tmp/{file.filename}"
    with open(file_path, 'wb') as f:
        f.write(await file.read())

    audio_response = handle_call(file_path)
    audio_url = upload_audio(user["id"], audio_response)    
    save_request(user_id=user["id"], request_type="call", content={"audio_response": "[voice generated]"}, source=file.filename, response_audio_url=audio_url) # type: ignore
    
    return {
        "response_audio_base64": base64.b64encode(audio_response).decode('utf-8'),
        "response_audio_url":audio_url
    }
