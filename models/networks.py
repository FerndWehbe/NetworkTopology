from sqlalchemy import Column, Integer, String, JSON
from .database import Base
from typing import Any


class Networks(Base):
    __tablename__ = "networks"
    id = Column(Integer, primary_key=True)
    name = Column(String(70), unique=True, nullable=False)
    map_data = Column(JSON, nullable=False)

    def __init__(
        self,
        name: str | None = None,
        map_data: dict | None | str = None,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        super().__init__(*args, **kwargs)
        self.name = name
        self.map_data = map_data

    def __repr__(self) -> str:
        return f"<{self.__tablename__} {self.name!r}>"
