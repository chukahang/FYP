from typing import List
from sentence_transformers import SentenceTransformer
import torch
import pickle

class EmbeddingModel:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """Initialize the sentence transformer model"""
        self.model = SentenceTransformer(model_name)

    def create_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Create embeddings for a list of texts"""
        return self.model.encode(texts).tolist()

    def _generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for a single text"""
        return self.model.encode(text).tolist()

    def save_embeddings(self, embeddings: list, file_path: str):
        # Save the generated embeddings to a file
        with open(file_path, 'wb') as f:
            pickle.dump(embeddings, f)

    def load_embeddings(self, file_path: str) -> list:
        # Load embeddings from a file
        with open(file_path, 'rb') as f:
            return pickle.load(f)