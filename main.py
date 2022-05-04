from flask import Flask, redirect, request, render_template, url_for, flash
import json
import os

app = Flask(__name__)

app.secret_key = b"asjdioj1892ja"


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
    print(list_files())
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

    with open(f"./static/arquivos_json/{name}.json", "w") as f:
        json.dump(dados, f, indent=4)
    return "Sucesso"


if __name__ == "__main__":
    app.run("0.0.0.0", 8000, True)
