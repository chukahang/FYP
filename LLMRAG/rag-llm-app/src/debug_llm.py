import sys
import os

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from llm.huggingface import HuggingFaceLLM
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_llm_response(model_name="facebook/opt-1.3b"):
    logger.info(f"Initializing LLM with model: {model_name}")
    llm = HuggingFaceLLM(model_name=model_name)
    
    # Test prompts
    test_prompts = [
        "Hello, I've been feeling anxious lately",
        "I'm having trouble sleeping",
        "I'm worried about my upcoming exams"
    ]
    
    for i, prompt in enumerate(test_prompts):
        logger.info(f"\n\nTest prompt {i+1}: {prompt}")
        
        # Disable logging temporarily to avoid cluttering the output
        logging.getLogger('llm.huggingface').setLevel(logging.WARNING)
        
        response = llm.generate_response(prompt)
        
        # Re-enable logging
        logging.getLogger('llm.huggingface').setLevel(logging.INFO)
        
        logger.info(f"Response: {response}\n")
        print(f"\n--- Test {i+1} ---")
        print(f"Prompt: {prompt}")
        print(f"Response: {response}")
        print("-" * 40)

if __name__ == "__main__":
    # Default model or specify one via command line
    model_name = sys.argv[1] if len(sys.argv) > 1 else "facebook/opt-1.3b"
    print(f"Testing LLM with model: {model_name}")
    test_llm_response(model_name)
    print("Testing complete!")
