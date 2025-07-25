import os
from pathlib import Path
import torch
from torch import nn
from torch.nn import functional as F
from torch.utils.data import Dataset, DataLoader

class SimpleDataset(Dataset):
    def __init__(self, text, block_size=64):
        chars = sorted(list(set(text)))
        self.stoi = {ch: i for i, ch in enumerate(chars)}
        self.itos = {i: ch for ch, i in self.stoi.items()}
        self.vocab_size = len(chars)
        self.block_size = block_size
        self.data = [self.stoi[c] for c in text]

    def __len__(self):
        return len(self.data) - self.block_size
    
    def __getitem__(self, idx):
        chunk = self.data[idx:idx + self.block_size + 1]
        x = torch.tensor(chunk[:-1], dtype=torch.long)
        y = torch.tensor(chunk[1:], dtype=torch.long)
        return x, y
    
    
class TinyGPT(nn.Module):
    def __init__(self, vocab_size, embed_dim=128, num_layers=2, dropout=0.2):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, embed_dim, num_layers=num_layers, batch_first=True, dropout=dropout)
        self.fc = nn.Linear(embed_dim, vocab_size)
    
    def forward(self, x):
        x = self.embed(x)
        x, _ = self.lstm(x)
        logits = self.fc(x)
        return logits


def train(text_path, model_path, epochs=100):
    text = Path(text_path).read_text()
    dataset = SimpleDataset(text)
    dataloader = DataLoader(dataset, batch_size=32, shuffle=True)

    model = TinyGPT(dataset.vocab_size, embed_dim=128, num_layers=2, dropout=0.2)
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
    loss_fn = nn.CrossEntropyLoss()

    best_loss = float("inf")

    for epoch in range(epochs):
        total_loss = 0
        for x, y in dataloader:
            logits = model(x)
            loss = loss_fn(logits.view(-1, dataset.vocab_size), y.view(-1))
            optimizer.zero_grad()
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            total_loss += loss.item()
        
        avg_loss = total_loss / len(dataloader)
        print(f"Epoch {epoch+1}, Loss: {total_loss:.4f}")

        if avg_loss < best_loss:
            best_loss = avg_loss
            os.makedirs(model_path, exist_ok=True)
            torch.save(model.state_dict(), os.path.join(model_path, "best_model.pt"))
            print(f"📌 Best model saved at epoch {epoch+1} with loss {best_loss:.4f}")
    
    torch.save(model.state_dict(), os.path.join(model_path, "model.pt"))
    print('Latest Model saved!')

if __name__ == "__main__":
    train("data/input.txt", "models")