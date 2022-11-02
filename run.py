from app.tools.base import load_files
from app.views import app_print
from app.extensions import db
from flask import Flask


def create_app():
    app = Flask(
        __name__, template_folder="app/templates", static_folder="app/static"
    )
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite3"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True

    app.register_blueprint(app_print)

    db.init_app(app)
    return app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
        load_files()

    app.run("0.0.0.0", 8000, False)
