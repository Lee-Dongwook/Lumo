from services.extractor import extract_text
from services.summarizer import summarize
from services.citation_finder import attach_citations

def run_research_pipeline(input_path:str,input_type:str):
    """
    End-to-end pipeline: Extract -> Summarize -> Cite
    """
    text = extract_text(input_path, input_type)
    summary = summarize(text)
    summary_with_citations = attach_citations(summary, text)

if __name__ == "__main__":
    import sys
    path = sys.argv[1]
    input_type = sys.argv[2]
    result = run_research_pipeline(path, input_type)
    print("\n=== Summary with Citations === \n")
    print(result)