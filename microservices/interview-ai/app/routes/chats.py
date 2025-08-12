from flask import Blueprint, request, jsonify
from app.services.stt_service import transcribe_audio
from app.services.llm_service import get_gemini_response
import os
import flask_cors
from flask_cors import cross_origin
import re
import uuid

chat = Blueprint('chat', __name__)



@chat.route('/api/ask', methods=['POST'])
@cross_origin()
def ask():
    # if 'audio' not in request.files:
    #     return jsonify({'error': 'No audio file provided'}), 400
    if 'audio' not in request.files and "message" not in request.form:
        return jsonify({'error': 'No audio file provided'}), 400

    if request.form.get("message") == "":
        audio_file = request.files['audio']
        filename = f"temp_{uuid.uuid4().hex}.mp3"
        filepath = os.path.join('static', filename)
        audio_file.save(filepath)

        # 1. STT
        transcription = transcribe_audio(filepath)

        # 2. LLM via Gemini Studio API
        response_text = get_gemini_response(transcription)
        # text = "He*llo! W@or#ld$%"
        cleaned = re.sub(r'[^a-zA-Z0-9\s]', '', response_text)
        print(cleaned)
        
        # 3. TTS 
        output_audio_path = os.path.join('static', f"reply_{uuid.uuid4().hex}.mp3")
        # audioUrl = synthesize_speech(cleaned, output_audio_path)
        
        return jsonify({
            "transcription": transcription,
            "response": cleaned,
            "audio_url": ""
        })
    else :
        audio_file = request.files['audio']
        filename = f"temp_{uuid.uuid4().hex}.mp3"
        filepath = os.path.join('static', filename)
        audio_file.save(filepath)

        # 1. STT
        transcription = request.form.get("message")

        # 2. LLM via Gemini Studio API
        response_text = get_gemini_response(transcription)
        # text = "He*llo! W@or#ld$%"
        # cleaned = re.sub(r'[^a-zA-Z0-9\s]', '', response_text)
        # print(cleaned)
        
        # 3. TTS 
        output_audio_path = os.path.join('static', f"reply_{uuid.uuid4().hex}.mp3")
        # audioUrl = synthesize_speech(cleaned, output_audio_path)
        
        return jsonify({
            "transcription": transcription,
            "response": response_text,
            "audio_url": ""
        })
