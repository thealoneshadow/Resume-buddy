from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes

    from .routes.chat import chat # type: ignore
    app.register_blueprint(chat)

    return app
