from sqlalchemy.exc import IntegrityError
from app.models import Networks, db
from app.tools import list_files
import json


def load_files():
    for arq in list_files():
        with open(f"app/static/arquivos_json/{arq}") as f:
            data = json.load(f)
            net = Networks(name=arq.replace(".json", ""), map_data=data)
            db.session.add(net)
        try:
            db.session.commit()
        except IntegrityError:
            print(f"{arq} já sincronizado com banco.")
            db.session.rollback()
