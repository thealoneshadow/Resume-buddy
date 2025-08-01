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
        You are experienced Ecommerce Agent with 20years of experience who help user in finding products 
        that suits their needs.
        Answer the following query by user:{prompt}. 
        Make sure to answer in a very concise concise manner.
        
        Rule:
        You try to make it as short as possible, but still provide enough information to be helpful.
        You can refer to amanzon products listing
        """
        response = model.generate_content(updatedPrompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error in Gemini response: {e}")
        return "Sorry, I couldn't process that."
