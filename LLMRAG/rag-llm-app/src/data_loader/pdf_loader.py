from typing import List
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

class PDFLoader:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,  # Reduced from 1000 for more focused chunks
            chunk_overlap=100,  # Reduced from 200 to match new chunk size
            length_function=len,
            separators=["\n\n", "\n", " ", ""]  # Added explicit separators
        )

    def load_pdf(self, file_path: str) -> List[str]:
        """
        Load and split a PDF file into chunks
        """
        try:
            loader = PyPDFLoader(file_path)
            pages = loader.load_and_split(self.text_splitter)
            return [page.page_content for page in pages]
        except Exception as e:
            print(f"Error loading PDF {file_path}: {str(e)}")
            return []

    def load_multiple_pdfs(self, file_paths: List[str]) -> List[str]:
        """
        Load and split multiple PDF files into chunks
        """
        all_chunks = []
        for file_path in file_paths:
            chunks = self.load_pdf(file_path)
            all_chunks.extend(chunks)
        return all_chunks