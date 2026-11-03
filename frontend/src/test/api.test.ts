import { describe, expect, it } from "vitest";

import { mensagemDeErro } from "@/lib/api";

describe("mensagemDeErro", () => {
  it("transforma o erro 422 do FastAPI em uma frase legivel", () => {
    const corpo = {
      detail: [{ msg: "Value error, A data de vencimento não pode estar no passado." }],
    };
    expect(mensagemDeErro(corpo)).toBe("A data de vencimento não pode estar no passado.");
  });

  it("junta varias mensagens", () => {
    const corpo = { detail: [{ msg: "Erro A." }, { msg: "Erro B." }] };
    expect(mensagemDeErro(corpo)).toBe("Erro A. Erro B.");
  });

  it("usa mensagem padrao quando nao ha detalhe", () => {
    expect(mensagemDeErro(null)).toMatch(/Não foi possível salvar/);
  });
});
