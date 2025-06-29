from typing import List
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')

def attach_citations(summary:str, source_text:str) -> str:
    source_sentences = source_text.split('. ')
    summary_points = summary.split('\n')

    source_embeddings = model.encode(source_sentences, convert_to_tensor=True)
    summary_with_cites = []

    for point in summary_points:
        if not point.strip():
            continue
        point_embedding = model.encode(point, convert_to_tensor=True)
        similarities = util.cos_sim(point_embedding, source_embeddings)[0]
        best_idx = int(similarities.argmax())
        cited = source_sentences[best_idx].strip()
        summary_with_cites.append(f"${point.strip()}\n> (Source: ${cited})\n")
    
    return "\n".join(summary_with_cites)