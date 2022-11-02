from app.extensions import db


class Networks(db.Model):  # type: ignore
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True)
    map_data = db.Column(db.JSON, nullable=False)

    def __repr__(self) -> str:
        return f"<{self.__tablename__} {self.name!r}>"
