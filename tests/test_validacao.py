from datetime import date, timedelta

from tests.test_lotes import novo_lote


def test_rejeita_vencimento_no_passado(client):
    assert novo_lote(client, dias=-1).status_code == 422


def test_aceita_vencimento_hoje(client):
    assert novo_lote(client, dias=0).status_code == 201


def test_rejeita_quantidade_negativa_ou_enorme(client):
    assert novo_lote(client, quantidade=-5).status_code == 422
    assert novo_lote(client, quantidade=10001).status_code == 422


def test_rejeita_categoria_fora_da_lista(client):
    assert novo_lote(client, categoria="'; DROP TABLE lotes_estoque;--").status_code == 422
