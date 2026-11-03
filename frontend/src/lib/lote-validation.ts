// Regras de obrigatoriedade do cadastro de lotes.
// Mantidas separadas da rota para poderem ser testadas e reutilizadas.

export type LoteFormValues = {
  categoria: string;
  quantidade: string;
  vencimento: Date | null;
};

export type LoteErrors = Partial<Record<keyof LoteFormValues, string | undefined>>;

export function validateLote(values: LoteFormValues, today: Date = new Date()): LoteErrors {
  const errors: LoteErrors = {};

  if (!values.categoria) {
    errors.categoria = "Selecione a categoria do alimento.";
  }

  const quantidade = Number(values.quantidade.replace(",", ".").trim());
  if (!values.quantidade.trim()) {
    errors.quantidade = "Informe a quantidade em kg.";
  } else if (!Number.isFinite(quantidade) || quantidade <= 0) {
    errors.quantidade = "A quantidade deve ser um número maior que zero.";
  }

  if (!values.vencimento) {
    errors.vencimento = "Selecione a data de vencimento.";
  } else if (startOfDay(values.vencimento) < startOfDay(today)) {
    errors.vencimento = "A data de vencimento não pode estar no passado.";
  }

  return errors;
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}
