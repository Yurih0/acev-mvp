from datetime import date
from typing import Literal, get_args

from pydantic import BaseModel, ConfigDict, Field, computed_field, field_validator

from app.services import calcular_status_prioridade

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

    @computed_field
    @property
    def status_prioridade(self) -> str:
        # Calculado a cada leitura: o status nunca fica desatualizado.
        return calcular_status_prioridade(self.data_vencimento)
