from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class UserModel(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)  # clerk_id
    stripe_id = Column(String)

    swarms = relationship("SwarmstarSpaceModel", back_populates="user")
