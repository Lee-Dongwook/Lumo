from services.extractor import extract_text

SUPPORTED_TYPES = {"pdf", "docx", "txt"}

def load_file_and_extract(path:str) -> str:
    """
    Determine file type from extension and extract text
    """

    ext = path.split(".")[-1].lower()
    if ext not in SUPPORTED_TYPES:
        raise ValueError(f"Unsupported file type: {ext}")
    
    return extract_text(path, ext)