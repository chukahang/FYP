import os
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Ensure proper import paths
current_file = Path(__file__).resolve()
src_dir = current_file.parent
project_root = current_file.parent.parent
sys.path.append(str(src_dir))
sys.path.append(str(project_root))

from main import RAGSystem

# Initialize the RAG System
rag = RAGSystem()

# Load documents on startup
docs_path = project_root / "data" / "documents"

# Load documents silently
try:
    num_chunks = rag.load_documents(docs_path)
    print(f"Loaded {num_chunks} document chunks from {docs_path}")
except Exception as e:
    print(f"Error loading documents: {e}")
    import traceback
    traceback.print_exc()

app = FastAPI(
    title="Mental Health RAG API",
    description="API for mental health consultation using RAG LLM",
    version="1.0.0"
)

# Add CORS middleware to allow cross-origin requests from your React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your actual frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request and response models
class ChatRequest(BaseModel):
    query: str
    history: Optional[List[Dict[str, str]]] = []

class InitializeRequest(BaseModel):
    videoProcessingReport: Optional[Dict[str, Any]] = None
    personalInformation: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    content: str

@app.post("/api/v1/chat/initialize", response_model=ChatResponse)
async def initialize_chat(request: InitializeRequest):
    try:
        # Initialize the chat with context from video processing report and personal information
        context = []
        
        if request.videoProcessingReport:
            context.append(f"Video Analysis Report: {request.videoProcessingReport}")
        
        if request.personalInformation:
            context.append(f"User Information: {request.personalInformation}")
        
        if context:
            # Prepare a context message for the RAG system
            context_message = "The system has been initialized with the following user context:\n" + "\n".join(context)
            # You may want to store this context in the RAG system's state for future queries
            # For now, we'll just return an acknowledgment
            return {"content": "I've analyzed your personal data and stress analysis results. How can I help you today?"}
        else:
            return {"content": "Chat initialized. How can I help you today?"}
    except Exception as e:
        print(f"Error initializing chat: {e}")
        raise HTTPException(status_code=500, detail=f"Error initializing chat: {str(e)}")

@app.post("/api/v1/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        response = rag.query(request.query)
        return {"content": response}
    except Exception as e:
        print(f"Error processing chat request: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.get("/")
async def root():
    return {
        "message": "Mental Health RAG API is running",
        "docs": "/docs",
        "usage": "Send POST requests to /api/v1/chat with a JSON body containing 'query'"
    }

def start_server():
    """Function to start the API server"""
    try:
        # Use a different port to avoid conflicts
        port = 5000
        print(f"Starting API server on http://127.0.0.1:{port}/docs")
        print("Press Ctrl+C to stop the server")
        
        # Try using the app directly without reload for debugging
        uvicorn.run(
            app,
            host="127.0.0.1",
            port=port,
            log_level="debug"  # Increased log level for debugging
        )
    except Exception as e:
        print(f"Error starting server: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    start_server()
