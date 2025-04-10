from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
from typing import List, Optional
import logging
import re

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class HuggingFaceLLM:
    def __init__(self, model_name: str = "facebook/opt-1.3b"):
        try:
            logger.info(f"Initializing HuggingFaceLLM with model: {model_name}")
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.model = AutoModelForCausalLM.from_pretrained(
                model_name,
                torch_dtype=torch.float16,
                device_map="auto"
            )
            
            # System prompt defining the consultant role - simplified and direct
            self.system_prompt = (
                "You are a professional mental health consultant responding directly to client messages. "
                "Provide concise, empathetic responses with evidence-based advice when appropriate. "
                "Keep responses focused, professional and helpful."
            )
            self.initialization_error = None
        except Exception as e:
            logger.error(f"Error initializing HuggingFaceLLM: {str(e)}")
            self.initialization_error = str(e)
    
    def generate_response(self, prompt: str, context: Optional[List[str]] = None) -> str:
        """Generate a direct response to the prompt without maintaining conversation history."""
        try:
            # Log the input but truncate long prompts
            truncated_prompt = prompt[:500] + "..." if len(prompt) > 50 else prompt
            logger.info(f"Generating response for prompt: '{truncated_prompt}'")
            
            if self.initialization_error:
                return f"I apologize, but I'm having technical difficulties: {self.initialization_error}"
            
           
            
            # Create simpler prompt for the model
            full_prompt = (
                "You are responding as a mental health professional. Keep your response direct, focused and helpful. Try to address the concern from Client.\n\n"
                f"Client: {prompt}\n\n"
                "Response:"
            )
            
            # Log the full prompt for debugging
            logger.debug(f"Full prompt: {full_prompt}")
            
            # Generate response with specified parameters
            inputs = self.tokenizer(full_prompt, return_tensors="pt", truncation=True, max_length=1024).to(self.model.device)
            
            # Disable tqdm progress bar to avoid "Batches: 100%" output
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=300,  # Shorter, more focused responses
                    min_new_tokens=20,
                    temperature=0.8,
                    do_sample=True,
                    top_p=0.92,
                    repetition_penalty=1.2,
                    no_repeat_ngram_size=3,
                    pad_token_id=self.tokenizer.eos_token_id,
                    eos_token_id=self.tokenizer.eos_token_id,
                    use_cache=True
                )

            response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # Clean up the response to get just what follows "Response:"
            if "Response:" in response:
                response = response.split("Response:")[-1].strip()
            
            # Remove any other role labels that might appear
            response = re.sub(r'Client:|Professional:|Consultant:', '', response)
            
            # Clean up formatting
            response = response.strip()
            
            # Final check for empty or too short responses
            if not response or len(response) < 20:
                response = "I understand your situation. Could you share more details so I can provide better guidance?"
                
            logger.info(f"Generated response: {response[:50]}...")
            return response
            
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}", exc_info=True)
            return "I apologize, but I encountered a technical issue. Please try again."