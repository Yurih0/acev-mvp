import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { Check, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { lerUltimoLote, type LoteSalvo } from "@/lib/ultimo-lote";

export const Route = createFileRoute("/lote-confirmado")({
  head: () => ({
    meta: [
      { title: "Registro Concluído com Sucesso! — ACEV Gestão" },
      {
        name: "description",
        content:
          "Confirmação de que o lote de mantimentos foi cadastrado no controle de estoque da ACEV, com o resumo dos dados salvos.",
      },
      { property: "og:title", content: "Registro Concluído com Sucesso! — ACEV Gestão" },
      {
        property: "og:description",
        content: "O lote de mantimentos foi cadastrado e integrado ao sistema com sucesso.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoteConfirmado,
});

function LoteConfirmado() {
  const [lote, setLote] = React.useState<LoteSalvo | null>(null);

  React.useEffect(() => {
    setLote(lerUltimoLote());
  }, []);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <main className="flex flex-1 items-center justify-center px-5 py-8">
        <section
          role="status"
          aria-live="polite"
          className="w-full rounded-2xl bg-card p-6 text-center shadow-sm ring-1 ring-border"
        >
          <div
            aria-hidden="true"
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success-soft ring-4 ring-success/15"
          >
            <Check className="h-11 w-11 text-success" strokeWidth={3} />
          </div>

          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground">
            Registro Concluído com Sucesso!
          </h1>
          <p className="mt-3 text-base leading-relaxed text-foreground/80">
            O lote de mantimentos foi cadastrado e integrado ao sistema com sucesso.
          </p>

          {lote ? (
            <dl className="mt-6 divide-y divide-border overflow-hidden rounded-xl bg-muted text-left">
              <Resumo campo="Lote" valor={lote.categoria} />
              <Resumo campo="Quantidade" valor={`${lote.quantidade} kg`} />
              <Resumo campo="Vencimento" valor={lote.vencimento} />
            </dl>
          ) : (
            <p className="mt-6 rounded-xl bg-muted p-4 text-sm text-foreground/75">
              Nenhum lote foi cadastrado nesta sessão. Volte ao painel e toque em “Novo Lote de
              Estoque” para registrar um novo alimento.
            </p>
          )}
        </section>
      </main>

      <footer className="sticky bottom-0 border-t border-border bg-background px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <Button
          asChild
          className="h-14 w-full rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-md active:scale-[0.98]"
        >
          <Link to="/">
            <Home className="mr-2 h-5 w-5" />
            Voltar ao Painel Inicial
          </Link>
        </Button>
      </footer>
    </div>
  );
}

function Resumo({ campo, valor }: { campo: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-4 py-3">
      <dt className="text-sm font-semibold text-muted-foreground">{campo}</dt>
      <dd className="text-base font-bold text-foreground">{valor}</dd>
    </div>
  );
}
