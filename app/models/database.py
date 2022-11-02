from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import create_engine

engine = create_engine("sqlite:///teste.db")
db_session = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
)

Base = declarative_base()
Base.query = db_session.query_property()
