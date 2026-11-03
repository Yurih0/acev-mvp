import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, Plus } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validateLote, type LoteErrors, type LoteFormValues } from "@/lib/lote-validation";
import { salvarUltimoLote } from "@/lib/ultimo-lote";
import { criarLote } from "@/lib/api";

export const Route = createFileRoute("/novo-lote")({
  head: () => ({
    meta: [
      { title: "Cadastrar Novo Lote — ACEV Gestão" },
      {
        name: "description",
        content:
          "Formulário de cadastro de lotes de alimentos da ACEV: categoria, quantidade em kg e data de vencimento.",
      },
      { property: "og:title", content: "Cadastrar Novo Lote — ACEV Gestão" },
      {
        property: "og:description",
        content: "Registre o lote em três campos: categoria, quantidade e data de vencimento.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NovoLote,
});

const CATEGORIAS = [
  { value: "graos", label: "Grãos e Cereais", exemplo: "Arroz, milho, aveia" },
  { value: "leguminosas", label: "Leguminosas", exemplo: "Feijão, lentilha, grão-de-bico" },
  { value: "oleos", label: "Óleos e Azeites", exemplo: "Óleo de soja, azeite" },
  { value: "hortifrutti", label: "Hortifrúti", exemplo: "Batata, cebola, banana" },
  { value: "laticinios", label: "Laticínios", exemplo: "Leite, queijo, iogurte" },
  { value: "enlatados", label: "Enlatados e Processados", exemplo: "Milho em conserva, sardinha" },
  { value: "higiene", label: "Higiene e Limpeza", exemplo: "Sabão, álcool, papel toalha" },
];

const campo =
  "h-14 w-full rounded-xl border-2 bg-background px-4 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25";

function NovoLote() {
  const navigate = useNavigate();
  const [values, setValues] = React.useState<LoteFormValues>({
    categoria: "",
    quantidade: "30",
    vencimento: new Date(2026, 11, 15),
  });
  const [errors, setErrors] = React.useState<LoteErrors>({});
  const [dataAberta, setDataAberta] = React.useState(false);
  const [enviando, setEnviando] = React.useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const proximos = validateLote(values);
    setErrors(proximos);
    if (Object.keys(proximos).length > 0) {
      toast.error("Revise os campos destacados.");
      return;
    }
    const categoria = CATEGORIAS.find((c) => c.value === values.categoria)?.label ?? "alimento";
    setEnviando(true);
    try {
      await criarLote({
        categoria,
        quantidade: Number(values.quantidade.replace(",", ".").trim()),
        data_vencimento: format(values.vencimento!, "yyyy-MM-dd"),
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível salvar o lote.");
      setEnviando(false);
      return;
    }
    salvarUltimoLote({
      categoria,
      quantidade: values.quantidade,
      vencimento: format(values.vencimento!, "dd/MM/yyyy"),
      salvoEm: new Date().toISOString(),
    });
    navigate({ to: "/lote-confirmado" });
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mx-auto flex min-h-screen max-w-md flex-col bg-background"
    >
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
        <Link
          to="/"
          aria-label="Voltar para o painel de estoque"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15"
        >
          <ChevronLeft className="h-7 w-7" />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-extrabold tracking-tight">Cadastrar Novo Lote</h1>
          <p className="truncate text-xs opacity-80">ACEV Gestão · estoque de alimentos</p>
        </div>
      </header>

      <main className="flex-1 space-y-6 px-5 pt-6 pb-40">
        <Field
          id="categoria"
          label="Categoria do Alimento"
          required
          error={errors.categoria}
          hint="Escolha o grupo em que o alimento será guardado."
        >
          <Select
            value={values.categoria}
            onValueChange={(categoria) => {
              setValues((v) => ({ ...v, categoria }));
              setErrors((e) => ({ ...e, categoria: undefined }));
            }}
          >
            <SelectTrigger
              id="categoria"
              aria-labelledby="categoria-label"
              aria-invalid={errors.categoria ? true : undefined}
              aria-describedby={errors.categoria ? "categoria-erro" : "categoria-hint"}
              className={cn(campo, "text-left", errors.categoria ? "border-critical" : "border-input")}
            >
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent className="max-h-[60vh]">
              {CATEGORIAS.map((c) => (
                <SelectItem key={c.value} value={c.value} className="py-3 text-base">
                  <span className="flex flex-col leading-tight">
                    <span className="font-semibold">{c.label}</span>
                    <span className="text-sm text-muted-foreground">{c.exemplo}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field
          id="quantidade"
          label="Quantidade (kg)"
          required
          error={errors.quantidade}
          hint="Somente números. Ex.: 30"
        >
          <div className="relative">
            <input
              id="quantidade"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.5"
              value={values.quantidade}
              onChange={(e) => {
                setValues((v) => ({ ...v, quantidade: e.target.value }));
                setErrors((er) => ({ ...er, quantidade: undefined }));
              }}
              aria-invalid={errors.quantidade ? true : undefined}
              aria-describedby={errors.quantidade ? "quantidade-erro" : "quantidade-hint"}
              className={cn(campo, "pr-16 font-semibold", errors.quantidade ? "border-critical" : "border-input")}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base font-bold text-muted-foreground">
              kg
            </span>
          </div>
        </Field>

        <Field
          id="vencimento"
          label="Data de Vencimento"
          required
          error={errors.vencimento}
          hint="Essa data define a ordem de distribuição (PEPS/FIFO)."
        >
          <Popover open={dataAberta} onOpenChange={setDataAberta}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                id="vencimento"
                aria-labelledby="vencimento-label"
                aria-invalid={errors.vencimento ? true : undefined}
                aria-describedby={errors.vencimento ? "vencimento-erro" : "vencimento-hint"}
                className={cn(
                  campo,
                  "justify-start rounded-xl px-4 font-normal",
                  errors.vencimento ? "border-critical" : "border-input",
                )}
              >
                <CalendarIcon className="mr-3 h-5 w-5 shrink-0 text-primary" />
                {values.vencimento ? (
                  format(values.vencimento, "dd/MM/yyyy")
                ) : (
                  <span className="text-muted-foreground">Selecione a data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={values.vencimento ?? undefined}
                initialFocus
                captionLayout="dropdown"
                className={cn("p-3 pointer-events-auto")}
                onSelect={(d) => {
                  setValues((v) => ({ ...v, vencimento: d ?? null }));
                  setErrors((e) => ({ ...e, vencimento: undefined }));
                  setDataAberta(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </Field>

        <section className="rounded-xl bg-muted p-4">
          <p className="text-sm font-bold text-foreground">Antes de salvar</p>
          <ul className="mt-2 space-y-1.5 text-sm text-foreground/80">
            <li>Os campos marcados com * são obrigatórios — sem eles o lote não é gravado.</li>
            <li>Informe a quantidade em quilogramas (kg), apenas números.</li>
            <li>A data de vencimento não pode estar no passado.</li>
          </ul>
        </section>
      </main>

      <footer className="sticky bottom-0 space-y-3 border-t border-border bg-background px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <Button
          type="submit"
          disabled={enviando}
          className="h-14 w-full rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-md active:scale-[0.98]"
        >
          <Plus className="mr-2 h-5 w-5" />
          {enviando ? "Salvando…" : "Salvar Lote"}
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-14 w-full rounded-xl border-2 border-primary bg-background text-lg font-bold text-primary active:scale-[0.98]"
        >
          <Link to="/">Cancelar</Link>
        </Button>
      </footer>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean | undefined;
  hint?: string | undefined;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label id={`${id}-label`} htmlFor={id} className="block text-base font-bold text-foreground">
        {label}
        {required && (
          <span className="text-critical" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-erro`} className="text-sm font-semibold text-critical">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
