# schemas.py
from pydantic import BaseModel

# Schemat bazowy (wspólne pola)
class WizytaBase(BaseModel):
    opis: str
    koszt: int
    czy_pilne: bool

# Schemat do tworzenia (Create)
class WizytaCreate(WizytaBase):
    pass

# Schemat do odczytu (Read) - zawiera ID
class WizytaResponse(WizytaBase):
    id: int

    class Config:
        from_attributes = True