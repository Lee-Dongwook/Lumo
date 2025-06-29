import os
from pathlib import Path

from pdfplumber import open as open_pdf
import docx2txt

def extract_text(file_path: str, file_type: str) -> str:
    if file_type == 'pdf':
        return extract_from_pdf(file_path)
    elif file_type == 'docx':
        return extract_from_docx(file_path)
    elif file_type == 'txt':
        return extract_from_txt(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_type}")
    
def extract_from_pdf(file_path:str) -> str:
    text= ""
    with open_pdf(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + '\n'
    return text


def extract_from_docx(file_path: str) -> str:
    return docx2txt.process(file_path)

def extract_from_txt(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()