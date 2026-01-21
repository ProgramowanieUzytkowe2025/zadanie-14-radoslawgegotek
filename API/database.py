from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import urllib.parse

# Oryginalny Connection String z zadania
raw_connection_string = (
    r"Driver={ODBC Driver 17 for SQL Server};"  # Dodano sterownik, konieczny dla pyodbc
    r"Server=(localdb)\MSSQLLocalDB;"
    r"Database=Szpital;"
    r"Trusted_Connection=yes;"
    r"Connect Timeout=30;"
    r"Encrypt=no;"
    r"TrustServerCertificate=no;"
    r"ApplicationIntent=ReadWrite;"
    r"MultiSubnetFailover=no;"
)

# Konwersja na format URL dla SQLAlchemy
params = urllib.parse.quote_plus(raw_connection_string)
SQLALCHEMY_DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={params}"

# Tworzenie silnika bazy danych
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)

# Sesja bazy danych
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Klasa bazowa dla modeli ORM
Base = declarative_base()

# Funkcja pomocnicza do pobierania sesji (Dependency Injection)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()