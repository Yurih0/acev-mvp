from datetime import date
from typing import Iterable

CRITICO = "Crítico"
ATENCAO = "Atenção"
EM_DIA = "Em dia"


def calcular_status_prioridade(data_vencimento: date, hoje: date | None = None) -> str:
    """Regra PEPS/FIFO: quanto mais perto do vencimento, maior a prioridade."""
    hoje = hoje or date.today()
    dias_restantes = (data_vencimento - hoje).days

    if dias_restantes <= 0:
        return CRITICO
    if dias_restantes <= 5:
        return ATENCAO
    return EM_DIA


def calcular_resumo(datas_vencimento: Iterable[date], hoje: date | None = None) -> dict:
    resumo = {"criticos": 0, "atencao": 0, "em_dia": 0}
    chaves = {CRITICO: "criticos", ATENCAO: "atencao", EM_DIA: "em_dia"}
    for data in datas_vencimento:
        resumo[chaves[calcular_status_prioridade(data, hoje)]] += 1
    return resumo
