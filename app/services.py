from datetime import date

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
