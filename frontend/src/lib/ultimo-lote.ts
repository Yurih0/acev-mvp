// Guarda o último lote cadastrado para a tela de confirmação conseguir exibir
// um resumo dos dados salvos. Mantido em src/lib e com o storage injetável
// para poder ser testado sem renderizar nenhuma rota.

export type LoteSalvo = {
  categoria: string;
  quantidade: string;
  vencimento: string;
  salvoEm: string;
};

export const CHAVE_ULTIMO_LOTE = "acev:ultimo-lote";

type Escrita = Pick<Storage, "setItem">;
type Leitura = Pick<Storage, "getItem">;

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

// `alvo` explícito: storage injetado (teste) ou `null` simulando ausência dele.
// Omitido: usa o sessionStorage real do navegador.
export function salvarUltimoLote(lote: LoteSalvo, alvo?: Escrita | null): boolean {
  const s = alvo === undefined ? storage() : alvo;
  if (!s) return false;
  try {
    s.setItem(CHAVE_ULTIMO_LOTE, JSON.stringify(lote));
    return true;
  } catch {
    return false;
  }
}

export function lerUltimoLote(alvo?: Leitura | null): LoteSalvo | null {
  const s = alvo === undefined ? storage() : alvo;
  if (!s) return null;
  try {
    const bruto = s.getItem(CHAVE_ULTIMO_LOTE);
    if (!bruto) return null;
    const dados = JSON.parse(bruto) as Partial<LoteSalvo>;
    if (
      typeof dados.categoria !== "string" ||
      typeof dados.quantidade !== "string" ||
      typeof dados.vencimento !== "string"
    ) {
      return null;
    }
    return {
      categoria: dados.categoria,
      quantidade: dados.quantidade,
      vencimento: dados.vencimento,
      salvoEm: typeof dados.salvoEm === "string" ? dados.salvoEm : "",
    };
  } catch {
    return null;
  }
}
