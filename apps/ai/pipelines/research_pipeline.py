from ai.services.extractor import extract_text
from ai.services.summarizer import summarize
from ai.services.citation_finder import attach_citations

def run_research_pipeline(input_path:str, input_type:str) -> str:
    """
    End-to-end processing pipeline:
    - Extract text from file
    - Summarize the content using LLM
    - Attach source sentences for citation
    """

    text = extract_text(input_path, input_type)

    if not text.strip():
        return "No text extracted from input."
    
    summary = summarize(text)
    summary_with_citations = attach_citations(summary, text)

    return summary_with_citations