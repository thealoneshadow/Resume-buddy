import pyttsx3
import os

engine = pyttsx3.init()

def synthesize_speech(text: str, output_path: str = None):
    """
    Convert text to speech.
    If output_path is provided, save to WAV file.
    Otherwise, play aloud.
    """
    if output_path:
        # Save to file
        # Note: pyttsx3 only supports saving on Windows by default.
        # On macOS/Linux, saving requires additional workarounds.
        try:
            engine.save_to_file(text, output_path)
            engine.runAndWait()
        except Exception as e:
            print(f"Error saving TTS audio: {e}")
    else:
        # Play aloud
        engine.say(text)
        engine.runAndWait()
