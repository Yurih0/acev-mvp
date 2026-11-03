import { describe, expect, it } from "vitest";

import { validateLote } from "@/lib/lote-validation";

const today = new Date(2026, 9, 31); // 31/10/2026
const exemplo = {
  categoria: "leguminosas",
  quantidade: "30",
  vencimento: new Date(2026, 11, 15), // 15/12/2026
};

describe("validateLote", () => {
  it("aceita o lote de exemplo totalmente preenchido", () => {
    expect(validateLote(exemplo, today)).toEqual({});
  });

  it("exige a categoria do alimento", () => {
    expect(validateLote({ ...exemplo, categoria: "" }, today).categoria).toBe(
      "Selecione a categoria do alimento.",
    );
  });

  it("exige a quantidade e rejeita zero", () => {
    expect(validateLote({ ...exemplo, quantidade: "" }, today).quantidade).toBe(
      "Informe a quantidade em kg.",
    );
    expect(validateLote({ ...exemplo, quantidade: "0" }, today).quantidade).toBe(
      "A quantidade deve ser um número maior que zero.",
    );
  });

  it("rejeita um vencimento no passado", () => {
    expect(
      validateLote({ ...exemplo, vencimento: new Date(2026, 9, 30) }, today).vencimento,
    ).toBe("A data de vencimento não pode estar no passado.");
  });

  it("aceita um vencimento no próprio dia", () => {
    expect(validateLote({ ...exemplo, vencimento: new Date(2026, 9, 31, 8, 0) }, today)).toEqual(
      {},
    );
  });

  it("exige a data de vencimento", () => {
    expect(validateLote({ ...exemplo, vencimento: null }, today).vencimento).toBe(
      "Selecione a data de vencimento.",
    );
  });
});
