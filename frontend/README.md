# ACEV Gestão — Front-end

Telas do painel de alertas, cadastro de lote e confirmação (React + TanStack Start, gerado no Lovable).
Conversa com a API FastAPI pelas rotas `/lotes/`, `/lotes/resumo` e `/lotes/` (POST).

```bash
npm install --legacy-peer-deps
npm test          # testes (vitest)
npm run build     # gera .output/public (site estático, modo SPA)
```

O conteúdo de `.output/public` (sem `_headers`) é copiado para `../app/static`.
Para testar o front separado da API, defina `VITE_API_URL=http://127.0.0.1:8000`.
