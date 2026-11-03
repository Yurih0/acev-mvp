// Cliente da API FastAPI da ACEV.
// Em producao o front-end e servido pela propria API (mesma origem), entao a base e vazia.
// Para testar o front separado, defina VITE_API_URL (ex.: http://127.0.0.1:8000).
const BASE = (import.meta.env?.["VITE_API_URL"] as string | undefined) ?? "";

export type StatusPrioridade = "Crítico" | "Atenção" | "Em dia";

export type Lote = {
  id: number;
  categoria: string;
  quantidade: number;
  data_vencimento: string; // AAAA-MM-DD
  status_prioridade: StatusPrioridade;
};

export type Resumo = { criticos: number; atencao: number; em_dia: number };

export type NovoLote = { categoria: string; quantidade: number; data_vencimento: string };

// Converte o corpo de erro do FastAPI (422 etc.) em uma frase legivel.
export function mensagemDeErro(corpo: unknown): string {
  const detail = (corpo as { detail?: unknown } | null)?.detail;
  if (Array.isArray(detail)) {
    const msgs = detail
      .map((d) => (typeof d?.msg === "string" ? d.msg.replace(/^Value error, /, "") : ""))
      .filter(Boolean);
    if (msgs.length) return msgs.join(" ");
  }
  if (typeof detail === "string") return detail;
  return "Não foi possível salvar o lote. Tente novamente.";
}

async function pedir<T>(caminho: string, init?: RequestInit): Promise<T> {
  const resposta = await fetch(`${BASE}${caminho}`, init);
  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => null);
    throw new Error(mensagemDeErro(corpo));
  }
  return resposta.json() as Promise<T>;
}

export function buscarPainel(): Promise<[Resumo, Lote[]]> {
  return Promise.all([pedir<Resumo>("/lotes/resumo"), pedir<Lote[]>("/lotes/")]);
}

export function criarLote(lote: NovoLote): Promise<Lote> {
  return pedir<Lote>("/lotes/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lote),
  });
}
