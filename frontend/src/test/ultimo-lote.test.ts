import { describe, expect, it } from "vitest";

import {
  CHAVE_ULTIMO_LOTE,
  lerUltimoLote,
  salvarUltimoLote,
  type LoteSalvo,
} from "@/lib/ultimo-lote";

const lote: LoteSalvo = {
  categoria: "Grãos e Cereais",
  quantidade: "30",
  vencimento: "15/12/2026",
  salvoEm: "2026-10-31T19:14:00.000Z",
};

function fakeStorage(initial: Record<string, string> = {}) {
  const dados = new Map(Object.entries(initial));
  return {
    getItem: (chave: string) => dados.get(chave) ?? null,
    setItem: (chave: string, valor: string) => {
      dados.set(chave, valor);
    },
  };
}

describe("ultimo lote salvo", () => {
  it("grava e recupera o lote cadastrado", () => {
    const alvo = fakeStorage();

    expect(salvarUltimoLote(lote, alvo)).toBe(true);
    expect(lerUltimoLote(alvo)).toEqual(lote);
  });

  it("grava sob a chave esperada", () => {
    const alvo = fakeStorage();
    salvarUltimoLote(lote, alvo);

    expect(JSON.parse(alvo.getItem(CHAVE_ULTIMO_LOTE) ?? "{}")).toMatchObject({
      categoria: "Grãos e Cereais",
      quantidade: "30",
      vencimento: "15/12/2026",
    });
  });

  it("retorna null quando ainda não há lote registrado", () => {
    expect(lerUltimoLote(fakeStorage())).toBeNull();
  });

  it("ignora conteúdo corrompido", () => {
    const alvo = fakeStorage({ [CHAVE_ULTIMO_LOTE]: "{nao é json" });

    expect(lerUltimoLote(alvo)).toBeNull();
  });

  it("ignora registro incompleto", () => {
    const alvo = fakeStorage({ [CHAVE_ULTIMO_LOTE]: JSON.stringify({ categoria: "Arroz" }) });

    expect(lerUltimoLote(alvo)).toBeNull();
  });

  it("falha sem storage disponível, sem lançar erro", () => {
    expect(salvarUltimoLote(lote, null)).toBe(false);
    expect(lerUltimoLote(null)).toBeNull();
  });
});
