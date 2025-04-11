import faiss
import numpy as np
from typing import List, Tuple

class VectorStore:
    def __init__(self, dimension: int):
        """Initialize FAISS index for vector similarity search"""
        self.dimension = dimension
        self.index = faiss.IndexFlatL2(dimension)
        self.text_chunks = []

    def add_documents(self, embeddings: List[List[float]], texts: List[str]):
        """Add document embeddings and their corresponding texts to the index"""
        if not embeddings:
            return
        
        embeddings_array = np.array(embeddings).astype('float32')
        self.index.add(embeddings_array)
        self.text_chunks.extend(texts)

    def search(self, query_embedding: List[float], k: int = 3) -> List[Tuple[str, float]]:
        """Search for most similar documents given a query embedding"""
        query_array = np.array([query_embedding]).astype('float32')
        distances, indices = self.index.search(query_array, k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(self.text_chunks):
                results.append((self.text_chunks[idx], distances[0][i]))
        
        return results

    def save_index(self, file_path: str):
        """Save the FAISS index to disk"""
        faiss.write_index(self.index, file_path)

    def load_index(self, file_path: str):
        """Load a FAISS index from disk"""
        self.index = faiss.read_index(file_path)