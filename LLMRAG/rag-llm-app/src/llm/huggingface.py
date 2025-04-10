from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
from typing import List

class HuggingFaceLLM:
    def __init__(self, model_name: str = "facebook/opt-1.3b"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch.float16,
            device_map="auto"
        )

    def generate_response(self, prompt: str, context: List[str] = None) -> str:
        """Generate a deeply empathetic response"""
        
        # Minimal context to keep responses personal
        context_text = ""
        if context and len(context) > 0:
            context_text = "Key insight: " + context[0].split(".")[0] + ".\n\n"

        # Emotional conversation prompt that encourages natural dialogue
        conversation = (
            "Below is a conversation where a mental health consultant responds with genuine empathy and understanding.\n\n"
            "Person: I'm feeling really overwhelmed with everything.\n"
            "Consultant: I can hear how overwhelming things are for you right now. It's completely natural to feel this way when there's so much on your shoulders. I'm here to listen and support you through this.\n\n"
            "Person: I don't know if I can handle all this pressure.\n"
            "Consultant: Your feelings are so valid. It takes courage to acknowledge when things feel too heavy to carry alone. Let's talk about what's weighing on you - I'm here to listen without judgment.\n\n"
            f"{context_text}"
            f"Person: {prompt}\n"
            "Consultant:"
        )

        # Generate with carefully tuned parameters for emotional responses
        inputs = self.tokenizer(conversation, return_tensors="pt", truncation=True, max_length=512).to(self.model.device)
        
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=100,
                min_new_tokens=30,    # Ensure responses aren't too short
                temperature=0.75,     # Balance between consistency and creativity
                do_sample=True,
                top_p=0.95,          # Allow more expressive language
                repetition_penalty=1.2,
                no_repeat_ngram_size=3,
                pad_token_id=self.tokenizer.eos_token_id,
                eos_token_id=self.tokenizer.eos_token_id
            )

        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Clean up the response
        if "Consultant:" in response:
            response = response.split("Consultant:")[-1]
        if "Person:" in response:
            response = response.split("Person:")[0]
        
        response = response.strip()
        
        # If response seems too short or robotic, provide a warm fallback
        if len(response) < 20 or "I am an AI" in response or "as an AI" in response:
            response = "I hear how much you're struggling with this academic pressure. It's completely natural to feel overwhelmed - you're dealing with a lot. I'm here to listen and support you through this. Would you like to tell me more about what's been most challenging for you?"
            
        return response