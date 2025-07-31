from flask import Flask

def create_app():
    app = Flask(__name__)

    from .routes.chat import chat # type: ignore
    app.register_blueprint(chat)

    return app
