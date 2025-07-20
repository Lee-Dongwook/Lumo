import torch
import torch.nn.functional as F
from pathlib import Path
from train import TinyGPT, SimpleDataset

class InferenceEngine:
    def __init__(self, model_path, text_path, device="cpu"):
        text = Path(text_path).read_text()
        self.dataset = SimpleDataset(text)
        self.model = TinyGPT(self.dataset.vocab_size)
        self.model.load_state_dict(torch.load(model_path, map_location=device))
        self.model.eval()
        self.device = device
        self.model.to(device)
    
    def generate(self, prompt, max_new_tokens=100, temperature=1.0, top_k=20):
        idxs = [self.dataset.stoi.get(c, 0) for c in prompt]
        input_ids = torch.tensor([idxs], dtype=torch.long).to(self.device)

        for _ in range(max_new_tokens):
            logits = self.model(input_ids)
            next_token_logits = logits[0, -1] / temperature

            if top_k is not None:
                values, indices = torch.topk(next_token_logits, top_k)
                probs = F.softmax(values, dim=-1)
                next_token = indices[torch.multinomial(probs, num_samples=1)].item()
            else:
                probs = F.softmax(next_token_logits, dim=-1)
                next_token = torch.multinomial(probs, num_samples=1).item()

            input_ids = torch.cat([input_ids, torch.tensor([[next_token]], device=self.device)], dim=1)
            
            generate_text = ''.join([self.dataset.itos[i] for i in input_ids[0].tolist()])
            if "\nUser:" in generate_text[len(prompt):]:
                break

        output = ''.join([self.dataset.itos[i] for i in input_ids[0].tolist()])
        return output
    
# 추론 함수
engine = InferenceEngine("models/model.pt", "data/input.txt")

def generate_response(prompt: str):
    return engine.generate(prompt)