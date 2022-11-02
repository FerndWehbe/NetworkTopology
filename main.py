from flask import Flask, redirect, request, render_template, url_for, flash
from models import db_session, init_db, Networks
from sqlalchemy.exc import IntegrityError
import json
import os

app = Flask(__name__)
init_db()


default_template = (
    {"Name": "Pai", "children": [{"Name": "filho", "children": []}]},
)


def list_files():
    return list(
        filter(
            lambda x: x.endswith(".json"), os.listdir("./static/arquivos_json")
        )
    )


@app.route("/index/")
@app.route("/")
def index():
    return render_template("index.html", list_files=list_files())


@app.route("/base/")
def base():
    return render_template("base.html")


@app.route("/editar/")
def editar():
    file_name = request.args.get("file_name")
    if not file_name:
        file_name = ""
    elif file_name not in list_files():
        flash("Arquivo não encontrado")
        return redirect(url_for("index"))
    return render_template("editar.html", file_name=file_name)


@app.route("/desenhar/")
def desenhar():
    file_name = request.args.get("file_name")
    if file_name:
        return render_template("desenhar.html", file=file_name)
    return redirect(url_for("index"))


@app.route("/save/", methods=["POST"])
def save():
    data = json.loads(request.get_data().decode())
    name = data["name"]
    dados = data["dados"]

    try:
        net = Networks(name, dados)
        db_session.add(net)
        db_session.commit()
    except IntegrityError:
        print(f"Chave name deve ser unica")

    with open(f"./static/arquivos_json/{name}.json", "w") as f:
        json.dump(dados, f, indent=4)
    return "Sucesso"


@app.route("/remove/")
def remove():
    return render_template("remover.html", list_files=list_files())


@app.route("/delete/", methods=["POST"])
def delete():
    data = json.loads(request.get_data().decode())
    list_name = data["file_name"]
    files = list_files()
    status = "Nenhum arquivo encontrado."
    for name in list_name:
        Networks.query.filter_by(name=name).delete()
        if name + ".json" in files:
            os.remove(f"./static/arquivos_json/{name}.json")
            status = "Removido com sucesso."
        else:
            status = "Falha na remoção do arquivos."
    return status


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


@app.route("/select/", methods=["GET"])
def select():
    name = request.args.get("name")
    data = Networks.query.filter(Networks.name == name).first()
    return f"{data.name} <br> {data.map_data}"


if __name__ == "__main__":
    app.run("0.0.0.0", 8000, True)
