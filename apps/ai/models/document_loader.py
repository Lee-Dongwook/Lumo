from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from pathlib import Path

def load_documents(path:str):
    ext = Path(path).suffix.lower()

    if ext == ".pdf":
        loader = PyPDFLoader(path) 
    elif ext == '.docx':
        loader = Docx2txtLoader(path)
    elif ext == '.txt':
        loader = TextLoader(path, encoding="utf-8")
    else:
        raise ValueError(f"Unsupported file extension: {ext}")
    
    return loader.load()