import os
from pathlib import Path
from data_loader.pdf_loader import PDFLoader
from embeddings.model import EmbeddingModel
from retriever.vector_store import VectorStore
from llm.huggingface import HuggingFaceLLM
import transformers
transformers.logging.set_verbosity_error()  # Disable the transformers progress bar

class RAGSystem:
    def __init__(self):
        self.pdf_loader = PDFLoader()
        self.embedding_model = EmbeddingModel("all-MiniLM-L6-v2")
        self.vector_store = None
        self.llm = HuggingFaceLLM()

    def load_documents(self, pdf_directory: Path):
        if not pdf_directory.exists():
            pdf_directory.mkdir(parents=True, exist_ok=True)
            return 0
            
        pdf_files = list(pdf_directory.glob("*.pdf"))
        if not pdf_files:
            return 0
            
        print("\nPreparing to better understand and support you...")
        text_chunks = self.pdf_loader.load_multiple_pdfs([str(f) for f in pdf_files])
        
        if not text_chunks:
            return 0
        
        embeddings = self.embedding_model.create_embeddings(text_chunks)
        self.vector_store = VectorStore(dimension=len(embeddings[0]))
        self.vector_store.add_documents(embeddings, text_chunks)
        return len(text_chunks)

    def query(self, question: str):
        if not self.vector_store:
            return self.llm.generate_response(question)

        question_embedding = self.embedding_model._generate_embedding(question)
        relevant_chunks = self.vector_store.search(question_embedding, k=2)
        context_texts = [chunk[0] for chunk in relevant_chunks]
        return self.llm.generate_response(question, context_texts)

def main():
    rag = RAGSystem()
    current_file = Path(__file__)
    project_root = current_file.parent.parent
    docs_path = project_root / "data" / "documents"
    
    print("\n💭 Mental Health Support Space 💭")
    print("I'm here to listen and support you with understanding and care.")
    print("Feel free to share what's on your mind. Type 'quit' when you're ready to end.\n")
    
    # Load documents silently
    rag.load_documents(docs_path)
    
    while True:
        try:
            user_input = input("\nYou: ").strip()
            if not user_input:
                continue
            if user_input.lower() == 'quit':
                print("\n❤️ Thank you for sharing. Remember, it's okay to reach out when you need support. Take good care of yourself. ❤️\n")
                break
            
            # Print with gentle formatting
            response = rag.query(user_input)
            print(f"\nConsultant: {response}")
            
        except KeyboardInterrupt:
            print("\n\n❤️ Take care of yourself. Remember, support is always here when you need it. ❤️\n")
            break
        except Exception as e:
            print("\nI care about what you're saying. Could you share that with me again?")

if __name__ == "__main__":
    main()