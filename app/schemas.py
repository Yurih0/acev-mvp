from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class LoteCreate(BaseModel):
    categoria: str = Field(..., min_length=2, max_length=100)
    quantidade: float = Field(..., gt=0)
    data_vencimento: date


class LoteResponse(LoteCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status_prioridade: str
