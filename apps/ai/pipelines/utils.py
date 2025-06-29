import re
from typing import List

def split_text(text: str, max_chunk_size: int = 500) -> List[str]:
    """
    Split long text into smaller chunks by paragraph or sentence.
    """
    paragraphs = re.split(r"\n\s*\n", text)
    chunks = []

    for para in paragraphs:
        if len(para) <= max_chunk_size:
            chunks.append(para.strip())
        else:
            # Further splut by sentence if too long
            sentences = re.split(r'(?<=[.!?])\s+',para)
            chunk = ''
            for sent in sentences:
                if len(chunk) + len(sent) <= max_chunk_size:
                    chunk += sent + " "
                else:
                    chunks.append(chunk.strip())
                    chunk = sent + " "

            if chunk:
                chunks.append(chunk.strip())
    
    return [c for c in chunks if c]