import json
import os

from flask import Blueprint, flash, redirect, render_template, request, url_for
from sqlalchemy.exc import IntegrityError

from .models import Networks, db
from .tools import list_files

app_print = Blueprint("profile", __name__)


@app_print.route("/base/")
def base():
    return render_template("base.html")


@app_print.route("/index/")
@app_print.route("/")
def index():
    return render_template("index.html", list_files=list_files())


@app_print.route("/editar/")
def editar():
    file_name = request.args.get("file_name")
    if not file_name:
        file_name = ""
    elif file_name not in list_files():
        flash("Arquivo não encontrado")
        return redirect(url_for("index"))
    return render_template("editar.html", file_name=file_name)


@app_print.route("/desenhar/")
def desenhar():
    file_name = request.args.get("file_name")
    if file_name:
        return render_template("desenhar.html", file=file_name)
    return redirect(url_for("index"))


@app_print.route("/save/", methods=["POST"])
def save():
    data = json.loads(request.get_data().decode())
    name = data["name"]
    dados = data["dados"]

    try:
        net = Networks(name=name, map_data=dados)
        db.session.add(net)
        db.session.commit()
    except IntegrityError:
        return "Chave name deve ser unica"

    with open(f"app/static/arquivos_json/{name}.json", "w", encoding="utf-8") as f:
        json.dump(dados, f, indent=4)
    return "Sucesso"


@app_print.route("/remove/")
def remove():
    return render_template("remover.html", list_files=list_files())


@app_print.route("/delete/", methods=["POST"])
def delete():
    data = json.loads(request.get_data().decode())
    list_name = data["file_name"]
    files = list_files()
    status = "Nenhum arquivo encontrado."
    for name in list_name:
        net = Networks.query.filter_by(name=name).one()
        db.session.delete(net)
        db.session.commit()
        if f"{name}.json" in files:
            os.remove(f"app/static/arquivos_json/{name}.json")
            status = "Removido com sucesso."
        else:
            status = "Falha na remoção do arquivos."
    return status


@app_print.route("/select/", methods=["GET"])
def select():
    name = request.args.get("name")
    data = Networks.query.filter(Networks.name == name).first()
    return f"{data.name} <br> {data.map_data}"
