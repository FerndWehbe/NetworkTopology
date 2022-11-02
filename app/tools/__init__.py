import os

default_template = (
    {"Name": "Pai", "children": [{"Name": "filho", "children": []}]},
)


def list_files():
    return list(
        filter(
            lambda x: x.endswith(".json"),
            os.listdir("./app/static/arquivos_json"),
        )
    )
