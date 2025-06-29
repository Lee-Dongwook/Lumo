import sys
from pipelines.research_pipeline import run_research_pipeline
from inputs.url_loader import extract_text_from_url

def main():
    if len(sys.argv) !=3:
        print("Usage: python main.py <input_path_or_url> <type: pdf|docx|txt|url>")
        return
    
    input_value = sys.argv[1]
    input_type = sys.argv[2]

    if input_type == 'url':
        text = extract_text_from_url(input_value)
        from services.summarizer import summarize
        from services.citation_finder import attach_citations
        summary = summarize(text)
        result = attach_citations(summary, text)
    
    else:
        result = run_research_pipeline(input_value, input_type)
    
    print("\n===== Summary with Citations =====\n")
    print(result)

if __name__ == "__main__":
    main()