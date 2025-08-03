from app.services.extractor import extract_key_information
from app.services.summarizer import summarize
from app.services.citation_finder import attach_citations

def run_research_pipeline(input_path:str,input_type:str):
    """
    End-to-end pipeline: Extract -> Summarize -> Cite
    """
    text = extract_key_information(input_path, input_type)
    summary = summarize(text)
    summary_with_citations = attach_citations(summary, text)

if __name__ == "__main__":
    import sys
    path = sys.argv[1]
    input_type = sys.argv[2]
    result = run_research_pipeline(path, input_type)
    print("\n=== Summary with Citations === \n")
    print(result)