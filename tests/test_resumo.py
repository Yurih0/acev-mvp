from datetime import date, timedelta

from app.services import calcular_resumo
from tests.test_lotes import novo_lote


def test_calcular_resumo():
    hoje = date(2026, 11, 1)
    datas = [hoje, hoje + timedelta(days=3), hoje + timedelta(days=4), hoje + timedelta(days=60)]
    assert calcular_resumo(datas, hoje) == {"criticos": 1, "atencao": 2, "em_dia": 1}


def test_rota_resumo_e_categorias(client):
    for dias in (0, 3, 30):
        novo_lote(client, dias=dias)
    assert client.get("/lotes/resumo").json() == {"criticos": 1, "atencao": 1, "em_dia": 1}
    assert "Leguminosas" in client.get("/categorias/").json()
