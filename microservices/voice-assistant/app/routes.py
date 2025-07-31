from flask import Blueprint, jsonify # type: ignore

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return jsonify({'message': 'Voice Assistant Backend is running!'})
