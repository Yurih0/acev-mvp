import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";

import { buscarPainel, type Lote, type Resumo, type StatusPrioridade } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ACEV Gestão — Controle de Estoque" },
      { name: "description", content: "Controle de estoque e validade (PEPS/FIFO) da Associação Comunitária Esperança Viva." },
      { property: "og:title", content: "ACEV Gestão — Controle de Estoque" },
      { property: "og:description", content: "Painel de alertas de validade e gestão de lotes de alimentos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Level = "critical" | "warning" | "ok";
const nivel: Record<StatusPrioridade, Level> = { "Crítico": "critical", "Atenção": "warning", "Em dia": "ok" };

function diasAte(iso: string): number {
  const [a = 0, m = 1, d = 1] = iso.split("-").map(Number);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Math.round((new Date(a, m - 1, d).getTime() - hoje.getTime()) / 86_400_000);
}

function textoPrazo(dias: number): string {
  if (dias < 0) return "Vencido";
  if (dias === 0) return "Vence hoje";
  return dias === 1 ? "Vence amanhã" : `Vence em ${dias} dias`;
}

const dataBR = (iso: string) => iso.split("-").reverse().join("/");

const styles: Record<Level, string> = {
  critical: "border-l-critical bg-critical-soft",
  warning: "border-l-warning bg-warning-soft",
  ok: "border-l-success bg-success-soft",
};
const badge: Record<Level, string> = {
  critical: "bg-critical text-critical-foreground",
  warning: "bg-warning text-warning-foreground",
  ok: "bg-success text-success-foreground",
};

function Index() {
  const [resumo, setResumo] = React.useState<Resumo>({ criticos: 0, atencao: 0, em_dia: 0 });
  const [lotes, setLotes] = React.useState<Lote[]>([]);
  const [carregando, setCarregando] = React.useState(true);
  const [erro, setErro] = React.useState(false);

  const carregar = React.useCallback(() => {
    setCarregando(true);
    setErro(false);
    buscarPainel()
      .then(([r, l]) => {
        setResumo(r);
        setLotes(l);
      })
      .catch(() => setErro(true))
      .finally(() => setCarregando(false));
  }, []);

  React.useEffect(carregar, [carregar]);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-primary px-5 py-4 text-primary-foreground">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">ACEV Gestão</h1>
          <p className="text-xs opacity-80">Associação Comunitária Esperança Viva</p>
        </div>
        <button aria-label="Perfil" className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/15">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
        </button>
      </header>

      <main className="flex-1 space-y-5 px-5 py-6">
        <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
          <h2 className="text-lg font-bold text-foreground">Painel de Alertas de Validade</h2>
          <p className="text-sm text-muted-foreground">Ordem PEPS/FIFO — primeiro que entra, primeiro que sai</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <Stat n={String(resumo.criticos)} t="Críticos" c="text-critical" />
            <Stat n={String(resumo.atencao)} t="Atenção" c="text-warning-strong" />
            <Stat n={String(resumo.em_dia)} t="Em dia" c="text-success" />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">Lotes por prioridade</h2>
          {carregando && <p className="text-sm text-muted-foreground" role="status">Carregando lotes…</p>}
          {erro && (
            <div className="rounded-xl bg-critical-soft p-4 text-sm font-semibold text-critical" role="alert">
              Não foi possível carregar os lotes.{" "}
              <button type="button" onClick={carregar} className="underline">Tentar novamente</button>
            </div>
          )}
          {!carregando && !erro && lotes.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum lote cadastrado ainda. Toque em “Novo Lote de Estoque” para começar.</p>
          )}
          {lotes.map((l) => {
            const level = nivel[l.status_prioridade];
            return (
              <article key={l.id} className={`rounded-xl border-l-8 p-4 ${styles[level]}`}>
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase ${badge[level]}`}>{l.status_prioridade}</span>
                <h3 className="mt-2 text-lg font-bold text-foreground">
                  {l.status_prioridade} - {textoPrazo(diasAte(l.data_vencimento))}: {l.categoria} {l.quantidade}kg
                </h3>
                <p className="text-sm text-foreground/75">
                  Lote #{String(l.id).padStart(4, "0")} · Vencimento {dataBR(l.data_vencimento)}
                </p>
              </article>
            );
          })}
        </section>
      </main>

      <footer className="sticky bottom-0 space-y-3 border-t border-border bg-background px-5 py-4">
        <Link to="/novo-lote" className="flex h-14 w-full items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-md active:scale-[0.98]">+ Novo Lote de Estoque</Link>
        <button className="h-14 w-full rounded-xl border-2 border-primary bg-background text-lg font-bold text-primary active:scale-[0.98]">Consultar Beneficiários</button>
      </footer>
    </div>
  );
}

function Stat({ n, t, c }: { n: string; t: string; c: string }) {
  return (
    <div className="rounded-xl bg-muted py-3">
      <div className={`text-3xl font-extrabold ${c}`}>{n}</div>
      <div className="text-xs font-semibold text-foreground">{t}</div>
    </div>
  );
}
