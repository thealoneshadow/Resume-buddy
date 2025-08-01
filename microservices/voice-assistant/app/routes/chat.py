from flask import Blueprint, request, jsonify
from app.services.stt_service import transcribe_audio
from app.services.llm_service import get_gemini_response
from app.services.tts_service import synthesize_speech
import os
import flask_cors
from flask_cors import cross_origin

import uuid

chat = Blueprint('chat', __name__)



@chat.route('/api/ask', methods=['POST'])
@cross_origin()
def ask():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    filename = f"temp_{uuid.uuid4().hex}.mp3"
    filepath = os.path.join('static', filename)
    audio_file.save(filepath)

    # 1. STT
    transcription = transcribe_audio(filepath)

    # 2. LLM via Gemini Studio API
    response_text = get_gemini_response(transcription)
    
    # 3. TTS 
    output_audio_path = os.path.join('static', f"reply_{uuid.uuid4().hex}.mp3")
    audioUrl = synthesize_speech(response_text, output_audio_path)
    
    return jsonify({
        "transcription": transcription,
        "response": response_text,
        "audio_url": audioUrl
    })
