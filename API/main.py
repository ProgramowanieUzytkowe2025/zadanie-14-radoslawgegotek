# main.py
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Szpital API", description="CRUD dla tabeli Wizyta")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CRUD OPERATIONS ---

@app.post("/wizyty/", response_model=schemas.WizytaResponse, status_code=status.HTTP_201_CREATED)
def create_wizyta(wizyta: schemas.WizytaCreate, db: Session = Depends(get_db)):
    db_wizyta = models.Wizyta(
        opis=wizyta.opis,
        koszt=wizyta.koszt,
        czy_pilne=wizyta.czy_pilne
    )
    
    if db_wizyta.koszt > 10000:
        raise HTTPException(
            status_code=400, 
            detail="Błąd serwera: Koszt wizyty nie może być wyższy niż 10 000 PLN."
        )
    # ------------------------------------
    db.add(db_wizyta)
    db.commit()
    db.refresh(db_wizyta)
    return db_wizyta

# --- MODYFIKACJA: Filtrowanie po stronie API ---
@app.get("/wizyty/", response_model=List[schemas.WizytaResponse])
def read_wizyty(
    skip: int = 0, 
    limit: int = 100, 
    pilne: Optional[bool] = None, # <--- TO JEST KLUCZOWE
    db: Session = Depends(get_db)
):
    query = db.query(models.Wizyta)
    
    # Jeśli parametr 'pilne' został przesłany (True lub False)
    if pilne is not None:
        query = query.filter(models.Wizyta.czy_pilne == pilne)
        
    wizyty = query.order_by(models.Wizyta.id).offset(skip).limit(limit).all()
    return wizyty

@app.get("/wizyty/{wizyta_id}", response_model=schemas.WizytaResponse)
def read_wizyta(wizyta_id: int, db: Session = Depends(get_db)):
    db_wizyta = db.query(models.Wizyta).filter(models.Wizyta.id == wizyta_id).first()
    if db_wizyta is None:
        raise HTTPException(status_code=404, detail="Wizyta nie znaleziona")
    return db_wizyta

@app.put("/wizyty/{wizyta_id}", response_model=schemas.WizytaResponse)
def update_wizyta(wizyta_id: int, wizyta_update: schemas.WizytaCreate, db: Session = Depends(get_db)):
    db_wizyta = db.query(models.Wizyta).filter(models.Wizyta.id == wizyta_id).first()
    if db_wizyta is None:
        raise HTTPException(status_code=404, detail="Wizyta nie znaleziona")
    
    # --- TO JEST BLOKADA (Wymaganie 3) ---
    if wizyta_update.koszt > 10000:
        raise HTTPException(
            status_code=400, 
            detail="Błąd serwera: Koszt wizyty nie może być wyższy niż 10 000 PLN."
        )
    # ------------------------------------

    db_wizyta.opis = wizyta_update.opis
    db_wizyta.koszt = wizyta_update.koszt
    db_wizyta.czy_pilne = wizyta_update.czy_pilne
    
    db.commit()
    db.refresh(db_wizyta)
    return db_wizyta

@app.delete("/wizyty/{wizyta_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_wizyta(wizyta_id: int, db: Session = Depends(get_db)):
    db_wizyta = db.query(models.Wizyta).filter(models.Wizyta.id == wizyta_id).first()
    if db_wizyta is None:
        raise HTTPException(status_code=404, detail="Wizyta nie znaleziona")
    
    # --- DODANO: Blokada usuwania (Punkt 8b) ---
    if not db_wizyta.czy_pilne:
        raise HTTPException(status_code=400, detail="Nie można usuwać wizyt, które nie są pilne!")
    
    db.delete(db_wizyta)
    db.commit()
    return None