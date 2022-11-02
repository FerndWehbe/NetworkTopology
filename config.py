import os

BASEDIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "AKSDOPKAOPK123901K0S91"


class DevelopmentConfig(Config):
    DEBUG = True
    LOG_BACKTRACE = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///dev_teste.db"


class ProductionConfig(Config):
    LOG_BACKTRACE = False
    SQLALCHEMY_DATABASE_URI = "sqlite:///prod_teste.db"


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
