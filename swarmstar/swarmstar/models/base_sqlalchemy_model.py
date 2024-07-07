from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declarative_base
from abc import ABC

Base = declarative_base()

class BaseSQLAlchemyModel(Base, ABC):
    __abstract__ = True
    id = Column(String, primary_key=True)
