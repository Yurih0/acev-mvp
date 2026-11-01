from datetime import date
from typing import Literal, get_args

from pydantic import BaseModel, ConfigDict, Field, field_validator

Categoria = Literal[
    "Grãos e Cereais",
    "Leguminosas",
    "Óleos e Gorduras",
    "Massas",
    "Enlatados",
    "Laticínios",
    "Outros",
]
CATEGORIAS = get_args(Categoria)


class LoteCreate(BaseModel):
    categoria: Categoria
    quantidade: float = Field(..., gt=0, le=10000)
    data_vencimento: date

    @field_validator("data_vencimento")
    @classmethod
    def vencimento_nao_pode_ser_passado(cls, valor: date) -> date:
        if valor < date.today():
            raise ValueError("A data de vencimento não pode estar no passado.")
        return valor


class LoteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    categoria: str
    quantidade: float
    data_vencimento: date
    status_prioridade: str
