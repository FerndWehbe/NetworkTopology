from .database import Base, engine, db_session
from .networks import *


def init_db():
    Base.metadata.create_all(bind=engine)
