from app.models import init_db, db_session
from app.views import app_print
from flask import Flask

app = Flask(
    __name__, template_folder="app/templates", static_folder="app/static"
)
app.register_blueprint(app_print)

init_db()


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


if __name__ == "__main__":
    app.run("0.0.0.0", 8000, True)
