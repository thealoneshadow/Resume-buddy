import requests
import os

import os
import google.generativeai as genai

# Load API key from environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


# Configure the Gemini SDK
genai.configure(api_key=GEMINI_API_KEY)

# Initialize the model (you can use gemini-pro or gemini-pro-vision for multimodal)
model = genai.GenerativeModel("gemini-2.5-flash")

def get_gemini_response(prompt: str) -> str:
    """
    Send a prompt to Gemini and return the response text.
    """
    try:
        updatedPrompt = f"""
        You are an experienced ecommerce expert with 20 years of knowledge. 
        Help users find the best products on Amazon based on their request. 
        Speak clearly and briefly, like you’re talking to someone. 
        Focus only on product suggestions, categories, or what to search for on Amazon.

        User said: "{prompt}"

        Note: Very Important
        Make sure not to use asterisks or any other special characters in your response.
        
        """
        response = model.generate_content(updatedPrompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error in Gemini response: {e}")
        return "Sorry, I couldn't process that."
