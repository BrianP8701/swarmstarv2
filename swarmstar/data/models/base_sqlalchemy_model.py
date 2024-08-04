from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declarative_base
from abc import ABCMeta, ABC
from sqlalchemy.ext.declarative import DeclarativeMeta

Base = declarative_base()

# Creating a new metaclass that combines features of both DeclarativeMeta and ABCMeta
class CombinedMeta(DeclarativeMeta, ABCMeta):
    pass

# Using the new metaclass for BaseSQLAlchemyModel
class BaseSQLAlchemyModel(Base, ABC, metaclass=CombinedMeta):
    __abstract__ = True
    id = Column(String, primary_key=True)