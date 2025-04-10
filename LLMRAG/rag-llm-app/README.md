# rag-llm-app README.md

# RAG LLM Application

This project implements a Retrieval-Augmented Generation (RAG) application that utilizes a Large Language Model (LLM) from Hugging Face. The application is designed to read datasets from local PDF files and cooperate with the LLM to generate responses based on the retrieved data.

## Project Structure

```
rag-llm-app
├── src
│   ├── main.py               # Entry point of the application
│   ├── data_loader           # Module for loading data
│   │   ├── __init__.py
│   │   └── pdf_loader.py     # PDF loading and text extraction
│   ├── embeddings            # Module for handling embeddings
│   │   ├── __init__.py
│   │   └── model.py          # Embedding model management
│   ├── retriever             # Module for retrieving embeddings
│   │   ├── __init__.py
│   │   └── vector_store.py    # Storage and retrieval of embeddings
│   └── llm                   # Module for interfacing with LLM
│       ├── __init__.py
│       └── huggingface.py    # Hugging Face API integration
├── data
│   └── documents             # Directory for local PDF documents
├── requirements.txt          # Project dependencies
└── README.md                 # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd rag-llm-app
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage

To run the application, execute the following command:
```
python src/main.py
```

## Components

- **PDFLoader**: Reads and extracts text from local PDF files.
- **EmbeddingModel**: Manages the creation and handling of text embeddings.
- **VectorStore**: Efficiently stores and retrieves embeddings for searching.
- **HuggingFaceLLM**: Interfaces with the Hugging Face API to generate responses based on retrieved data.

## License

This project is licensed under the MIT License.