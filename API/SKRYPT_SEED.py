# seed.py
from database import SessionLocal
import models

def seed_db():
    # Utworzenie sesji bazy danych
    db = SessionLocal()
    
    try:
        # Lista przykładowych rekordów do dodania
        wizyty_do_dodania = [
            models.Wizyta(opis="Konsultacja kardiologiczna", koszt=200, czy_pilne=False),
            models.Wizyta(opis="Ostry ból brzucha - SOR", koszt=0, czy_pilne=True),
            models.Wizyta(opis="Badanie krwi - morfologia", koszt=50, czy_pilne=False),
            models.Wizyta(opis="Złamanie ręki - gipsowanie", koszt=450, czy_pilne=True),
            models.Wizyta(opis="Kontrola dermatologiczna", koszt=150, czy_pilne=False)
        ]

        # Dodanie wszystkich obiektów do sesji
        db.add_all(wizyty_do_dodania)
        
        # Zatwierdzenie transakcji (zapis do bazy)
        db.commit()
        
        print(f"Sukces! Dodano {len(wizyty_do_dodania)} przykładowych rekordów do tabeli Wizyta.")

    except Exception as e:
        print(f"Wystąpił błąd podczas dodawania danych: {e}")
        db.rollback() # Cofnięcie zmian w razie błędu
    finally:
        db.close() # Zamknięcie połączenia

if __name__ == "__main__":
    seed_db()