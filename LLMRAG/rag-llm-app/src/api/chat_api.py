import logging
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional, Union, Dict, Any
import uuid

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

try:
    from ..llm.huggingface import HuggingFaceLLM
    # Initialize LLM globally so it's loaded only once
    llm = HuggingFaceLLM()
except Exception as e:
    logger.error(f"Failed to initialize LLM: {str(e)}", exc_info=True)
    llm = None

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    context: Optional[List[str]] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """API endpoint for chat interactions"""
    try:
        logger.info(f"Chat request received: {request.message[:50]}...")
        
        if llm is None:
            logger.error("LLM not initialized")
            raise HTTPException(status_code=500, detail="LLM not initialized")
        
        # Ensure session_id is a string if provided
        session_id = request.session_id
        if session_id is not None and not isinstance(session_id, str):
            logger.warning(f"Converting non-string session_id to string: {type(session_id)}")
            session_id = str(session_id)
        else:
            # Generate a new session ID if not provided
            session_id = session_id or str(uuid.uuid4())
        
        # If this is a new session, start it
        if not request.session_id:
            logger.info(f"Starting new session {session_id}")
            llm.start_session(session_id, context=request.context)
        
        # Generate response
        response = llm.generate_response(
            prompt=request.message,
            session_id=session_id,
            context=request.context
        )
        
        logger.info(f"Generated response: {response[:50]}...")
        return ChatResponse(response=response, session_id=session_id)
    
    except Exception as e:
        logger.error(f"Error in chat_endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.delete("/chat/{session_id}")
async def end_chat_session(session_id: str):
    """End a chat session"""
    try:
        if llm is None:
            raise HTTPException(status_code=500, detail="LLM not initialized")
            
        success = llm.end_session(session_id)
        if success:
            return {"message": f"Session {session_id} ended successfully"}
        else:
            raise HTTPException(status_code=404, detail=f"Session {session_id} not found")
    except Exception as e:
        logger.error(f"Error in end_chat_session: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
