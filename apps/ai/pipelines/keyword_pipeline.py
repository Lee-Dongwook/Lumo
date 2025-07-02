from typing import List
from ai.services.url_crawler import google_search
from ai.inputs.url_loader import extract_text_from_url
from ai.services.summarizer import summarize
from ai.services.citation_finder import attach_citations

def run_keyword_pipeline(keyword:str, num_results: int=5) -> dict:
    urls: List[str] = google_search(keyword, num_results=num_results)

    texts=[]
    for url in urls:
        text = extract_text_from_url(url)
        if text.strip():
            texts.append((url, text))

    combined_text = "\n".join(t[1] for t in texts)
    summary = summarize(combined_text)
    final_result = attach_citations(summary, combined_text)

    return {
        "summary": final_result,
        "sources": [t[0] for t in texts]
    }