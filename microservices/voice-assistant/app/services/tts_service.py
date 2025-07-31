from gtts import gTTS
from playsound import playsound
import os
import uuid

def synthesize_speech(text: str, output_path: str = None):
    """
    Convert text to speech using gTTS.
    If output_path is provided, save to MP3 file.
    Otherwise, play aloud.
    """
    try:
        if not text:
            print("No text provided for TTS.")
            return

        # Generate audio
        tts = gTTS(text=text, lang='en')

        if output_path:
            # Save to specified file
            tts.save(output_path)
            print(f"TTS audio saved to: {output_path}")
        else:
            # Save to a temporary file and play
            temp_file = f"/tmp/{uuid.uuid4()}.mp3"
            tts.save(temp_file)
            playsound(temp_file)
            os.remove(temp_file)

    except Exception as e:
        print(f"Error during TTS synthesis: {e}")
