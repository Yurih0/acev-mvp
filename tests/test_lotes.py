from datetime import date, timedelta

from app.services import calcular_status_prioridade


def novo_lote(client, categoria="Leguminosas", quantidade=1, dias=3):
    venc = (date.today() + timedelta(days=dias)).isoformat()
    return client.post(
        "/lotes/",
        json={"categoria": categoria, "quantidade": quantidade, "data_vencimento": venc},
    )


def test_interface_e_saude(client):
    assert "ACEV Gestão" in client.get("/").text
    assert client.get("/saude").status_code == 200


def test_status_prioridade():
    hoje = date(2026, 11, 1)
    assert calcular_status_prioridade(hoje - timedelta(days=1), hoje) == "Crítico"
    assert calcular_status_prioridade(hoje, hoje) == "Crítico"
    assert calcular_status_prioridade(hoje + timedelta(days=5), hoje) == "Atenção"
    assert calcular_status_prioridade(hoje + timedelta(days=6), hoje) == "Em dia"


def test_criar_lote(client):
    r = novo_lote(client, dias=3)
    assert r.status_code == 201
    assert r.json()["id"] == 1
    assert r.json()["status_prioridade"] == "Atenção"


def test_listagem_ordenada_por_vencimento(client):
    for cat, dias in [("Leguminosas", 20), ("Laticínios", 2), ("Hortifrúti", 10)]:
        novo_lote(client, categoria=cat, dias=dias)
    r = client.get("/lotes/")
    assert [l["categoria"] for l in r.json()] == ["Laticínios", "Hortifrúti", "Leguminosas"]
