#!/usr/bin/env python3
"""
Lumo AI CLI Tool
파일/URL 처리 파이프라인을 실행하는 CLI 도구
"""

import sys
from app.pipelines.research_pipeline import run_research_pipeline
from app.inputs.url_loader import extract_text_from_url
from app.services.summarizer import summarize
from app.services.citation_finder import attach_citations

def main():
    if len(sys.argv) != 3:
        print("Usage: python cli.py <input_path_or_url> <type: pdf|docx|txt|url>")
        print("Examples:")
        print("  python cli.py sample.pdf pdf")
        print("  python cli.py https://example.com url")
        return
    
    input_value = sys.argv[1]
    input_type = sys.argv[2]

    print(f"Processing {input_type}: {input_value}")

    try:
        if input_type == 'url':
            text = extract_text_from_url(input_value)
            summary = summarize(text)
            result = attach_citations(summary, text)
        else:
            result = run_research_pipeline(input_value, input_type)
        
        print("\n===== Summary with Citations =====\n")
        print(result)
        
    except Exception as e:
        print(f"Error processing {input_type}: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 