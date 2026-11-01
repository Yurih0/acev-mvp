# ACEV Gestão — MVP de Controle de Estoque e Validade (PEPS/FIFO)

MVP (Minimum Viable Product) desenvolvido para a **Associação Comunitária Esperança Viva (ACEV)**, liderada pela Sra. Helena Soares, com foco na redução do desperdício de alimentos (ODS 2 e ODS 12) e na gestão equitativa de mantimentos para 120 famílias do bairro Jardim Progresso.

O sistema registra os lotes de alimentos e calcula automaticamente a prioridade de uso conforme a data de vencimento (método **PEPS/FIFO** — Primeiro que Entra, Primeiro que Sai).

## 🛠️ Stack Tecnológica

- **Backend:** Python 3.12+ e FastAPI
- **Banco de dados:** PostgreSQL via SQLAlchemy 2.0 (ORM)
- **Validação de dados:** Pydantic 2
- **Interface:** HTML, CSS e JavaScript puros (mobile first), servidos pela própria API
- **Testes:** pytest

## 📁 Estrutura do Projeto

```text
acev-mvp/
├── app/
│   ├── database.py   # conexão com o banco (SQLAlchemy)
│   ├── models.py     # entidades LoteEstoque e Beneficiario
│   ├── schemas.py    # validação de entrada/saída (Pydantic)
│   ├── services.py   # regra de negócio PEPS/FIFO (sem dependência de banco)
│   ├── main.py       # rotas da API
│   └── static/
│       └── index.html  # interface: painel, cadastro e confirmação
├── tests/            # testes automatizados
├── .env.example
├── requirements.txt
└── requirements-dev.txt
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

4. Configure o banco de dados. Copie o `.env.example` para `.env` e ajuste a `DATABASE_URL`. Para testar sem PostgreSQL, use `DATABASE_URL=sqlite:///./acev.db`.

5. Inicie o servidor:

   ```bash
   uvicorn app.main:app --reload
   ```

6. Abra a interface em <http://127.0.0.1:8000> e a documentação da API em <http://127.0.0.1:8000/docs>.

## 🔌 Rotas da API

| Método | Rota             | Descrição                                                         |
|--------|------------------|-------------------------------------------------------------------|
| GET    | `/`              | Interface web (painel, cadastro e confirmação)                    |
| GET    | `/saude`         | Verifica se a API está no ar                                      |
| GET    | `/categorias/`   | Lista as categorias de alimento permitidas                        |
| POST   | `/lotes/`        | Cadastra um lote                                                  |
| GET    | `/lotes/`        | Lista os lotes ordenados por vencimento (PEPS/FIFO)               |
| GET    | `/lotes/resumo`  | Totais de lotes Críticos, Atenção e Em dia                        |

**Regra de prioridade** (calculada a cada leitura): vencido ou vence hoje → *Crítico*; vence em até 5 dias → *Atenção*; acima disso → *Em dia*.

**Validações:** categoria dentro da lista, quantidade entre 0 e 10.000 kg e data de vencimento que não esteja no passado.

## 🧪 Testes

```bash
pip install -r requirements-dev.txt
pytest
```

Os testes usam SQLite em memória, então não precisam de PostgreSQL.

## 🗺️ Próximos Passos

- Rotas de cadastro e consulta de beneficiários
- Autenticação e rotas protegidas
- Campos de número do lote e prateleira
- Migrações de banco com Alembic
