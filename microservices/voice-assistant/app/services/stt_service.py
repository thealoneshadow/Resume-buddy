import openai

def transcribe_audio(filepath):
    with open(filepath, "rb") as file:
        transcript = openai.Audio.transcribe("whisper-1", file)
    return transcript["text"]