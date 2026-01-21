# models.py
from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Wizyta(Base):
    __tablename__ = "Wizyta"

    id = Column(Integer, primary_key=True, index=True)
    opis = Column(String(255), nullable=False)  # Pole tekstowe
    koszt = Column(Integer, nullable=False)     # Pole liczbowe
    czy_pilne = Column(Boolean, default=False)  # Pole boolowskie