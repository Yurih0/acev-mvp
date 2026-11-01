from sqlalchemy import Column, Date, Float, Integer, String

from app.database import Base


class LoteEstoque(Base):
    __tablename__ = "lotes_estoque"

    id = Column(Integer, primary_key=True, index=True)
    categoria = Column(String(100), nullable=False)
    quantidade = Column(Float, nullable=False)
    data_vencimento = Column(Date, nullable=False)
    status_prioridade = Column(String(50), nullable=False)  # Crítico, Atenção, Em dia


class Beneficiario(Base):
    __tablename__ = "beneficiarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    familiares = Column(Integer, nullable=False)
    bairro = Column(String(100), default="Jardim Progresso")
