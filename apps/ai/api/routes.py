from fastapi import APIRouter, UploadFile, File, Form
from ai.pipelines.research_pipeline import run_research_pipeline
from ai.inputs.url_loader import extract_text_from_url
from ai.services.summarizer import summarize
from ai.services.citation_finder import attach_citations

router = APIRouter()

@router.post("/analyze/file")
async def analyze_file(file: UploadFile = File(...), file_type: str = Form(...)):
    path = f"/tmp/${file.filename}"
    with open(path, "wb") as f:
        f.write(await file.read())

    result = run_research_pipeline(path, file_type)
    return {"result": result}


@router.post("/analyze/url")
async def analyze_url(url: str = Form(...)):
    text = extract_text_from_url(url)
    summary = summarize(text)
    result = attach_citations(summary, text)
    return {"result": result}