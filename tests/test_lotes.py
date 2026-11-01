import os
from datetime import date, timedelta

# Usa SQLite em memoria nos testes (precisa vir antes de importar a app)
os.environ["DATABASE_URL"] = "sqlite://"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app, calcular_status_prioridade
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSession()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def banco_limpo():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


client = TestClient(app)


def test_raiz():
    r = client.get("/")
    assert r.status_code == 200


def test_status_prioridade():
    hoje = date(2026, 11, 1)
    assert calcular_status_prioridade(hoje - timedelta(days=1), hoje) == "Crítico"
    assert calcular_status_prioridade(hoje, hoje) == "Crítico"
    assert calcular_status_prioridade(hoje + timedelta(days=5), hoje) == "Atenção"
    assert calcular_status_prioridade(hoje + timedelta(days=6), hoje) == "Em dia"


def test_criar_lote():
    venc = (date.today() + timedelta(days=3)).isoformat()
    r = client.post("/lotes/", json={"categoria": "Arroz", "quantidade": 10, "data_vencimento": venc})
    assert r.status_code == 201
    corpo = r.json()
    assert corpo["id"] == 1
    assert corpo["status_prioridade"] == "Atenção"


def test_quantidade_invalida():
    venc = (date.today() + timedelta(days=3)).isoformat()
    r = client.post("/lotes/", json={"categoria": "Arroz", "quantidade": 0, "data_vencimento": venc})
    assert r.status_code == 422


def test_listagem_ordenada_por_vencimento():
    hoje = date.today()
    for cat, dias in [("Feijão", 20), ("Leite", 2), ("Macarrão", 10)]:
        client.post("/lotes/", json={
            "categoria": cat, "quantidade": 1,
            "data_vencimento": (hoje + timedelta(days=dias)).isoformat(),
        })
    r = client.get("/lotes/")
    assert r.status_code == 200
    assert [l["categoria"] for l in r.json()] == ["Leite", "Macarrão", "Feijão"]
