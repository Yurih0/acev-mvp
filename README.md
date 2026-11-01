# ACEV Gestão — MVP de Controle de Estoque e Validade (PEPS/FIFO)

MVP (Minimum Viable Product) desenvolvido para a **Associação Comunitária Esperança Viva (ACEV)**, liderada pela Sra. Helena Soares, com foco na redução do desperdício de alimentos (ODS 2 e ODS 12) e na gestão equitativa de mantimentos para 120 famílias do bairro Jardim Progresso.

O sistema registra os lotes de alimentos e calcula automaticamente a prioridade de uso conforme a data de vencimento (método **PEPS/FIFO** — Primeiro que Entra, Primeiro que Sai).

## 🛠️ Stack Tecnológica

- **Backend:** Python 3.12+ e FastAPI
- **Banco de dados:** PostgreSQL via SQLAlchemy 2.0 (ORM)
- **Validação de dados:** Pydantic 2
- **Testes:** pytest

## 📁 Estrutura do Projeto

```text
acev-mvp/
├── app/
│   ├── __init__.py
│   ├── database.py   # conexão com o banco (SQLAlchemy)
│   ├── models.py     # entidades LoteEstoque e Beneficiario
│   ├── schemas.py    # validação de entrada/saída (Pydantic)
│   └── main.py       # rotas da API
├── tests/
│   └── test_lotes.py
├── .env.example
├── requirements.txt
└── README.md
```

## 🚀 Como Executar Localmente

1. Clone o repositório:

   ```bash
   git clone https://github.com/Yurih0/acev-mvp.git
   cd acev-mvp
   ```

2. Crie e ative um ambiente virtual:

   ```bash
   python -m venv venv
   source venv/bin/activate   # No Windows: venv\Scripts\activate
   ```

3. Instale as dependências:

   ```bash
   pip install -r requirements.txt
   ```

4. Configure o banco de dados. Copie o `.env.example` para `.env` e ajuste a `DATABASE_URL` com os dados do seu PostgreSQL:

   ```bash
   cp .env.example .env   # No Windows: copy .env.example .env
   ```

5. Inicie o servidor:

   ```bash
   uvicorn app.main:app --reload
   ```

6. Acesse a documentação interativa em <http://127.0.0.1:8000/docs>.

## 🔌 Rotas da API

| Método | Rota      | Descrição                                                    |
|--------|-----------|--------------------------------------------------------------|
| GET    | `/`       | Verifica se a API está no ar                                 |
| POST   | `/lotes/` | Cadastra um lote e calcula a prioridade (Crítico/Atenção/Em dia) |
| GET    | `/lotes/` | Lista os lotes ordenados por vencimento (PEPS/FIFO)          |

**Regra de prioridade:** vencido ou vence hoje → *Crítico*; vence em até 5 dias → *Atenção*; acima disso → *Em dia*.

## 🧪 Testes

```bash
pip install -r requirements-dev.txt
pytest
```

Os testes usam SQLite em memória, então não precisam de PostgreSQL.

## 🗺️ Próximos Passos

- Rotas de cadastro e consulta de beneficiários
- Autenticação e rotas protegidas
- Interface web (PWA) com os painéis de alertas
