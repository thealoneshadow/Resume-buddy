from faster_whisper import WhisperModel

# Choose a small model (can also try "tiny.en")
model = WhisperModel("tiny", compute_type="int8")  # int8 is more memory-efficient

def transcribe_audio(filepath):
    segments, _ = model.transcribe(filepath)
    return " ".join([segment.text for segment in segments])
