from contextlib import asynccontextmanager
from datetime import date

from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models import LoteEstoque
from app.schemas import LoteCreate, LoteResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Cria as tabelas ao iniciar o servidor (e nao ao importar o modulo)
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="ACEV Gestão - API",
    description="Backend FastAPI para controle de estoque e validade PEPS/FIFO da ACEV.",
    version="1.0.0",
    lifespan=lifespan,
)


def calcular_status_prioridade(data_vencimento: date, hoje: date | None = None) -> str:
    """Regra PEPS/FIFO: quanto mais perto do vencimento, maior a prioridade."""
    hoje = hoje or date.today()
    dias_restantes = (data_vencimento - hoje).days

    if dias_restantes <= 0:
        return "Crítico"
    if dias_restantes <= 5:
        return "Atenção"
    return "Em dia"


@app.get("/")
def read_root():
    return {"message": "API da Associação Comunitária Esperança Viva (ACEV) em operação."}


@app.post("/lotes/", response_model=LoteResponse, status_code=201)
def criar_lote(lote: LoteCreate, db: Session = Depends(get_db)):
    db_lote = LoteEstoque(
        categoria=lote.categoria,
        quantidade=lote.quantidade,
        data_vencimento=lote.data_vencimento,
        status_prioridade=calcular_status_prioridade(lote.data_vencimento),
    )
    db.add(db_lote)
    db.commit()
    db.refresh(db_lote)
    return db_lote


@app.get("/lotes/", response_model=list[LoteResponse])
def listar_lotes(db: Session = Depends(get_db)):
    # Lotes que vencem primeiro aparecem primeiro (PEPS/FIFO)
    return db.query(LoteEstoque).order_by(LoteEstoque.data_vencimento.asc()).all()
