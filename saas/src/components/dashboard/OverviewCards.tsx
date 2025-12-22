const cards = [
  {
    label: "القضايا النشطة",
    value: "64",
    trend: "+14%",
    trendLabel: "vs. last month",
    tone: "positive" as const,
  },
  {
    label: "المهام المفتوحة",
    value: "23",
    trend: "-9%",
    trendLabel: "SLA breaches",
    tone: "positive" as const,
  },
  {
    label: "متوسط مدة إقفال القضية",
    value: "42 يومًا",
    trend: "-18%",
    trendLabel: "time to close",
    tone: "positive" as const,
  },
  {
    label: "رسوم القضايا المتوقعة",
    value: "$ 120K",
    trend: "+6%",
    trendLabel: "next 30 days",
    tone: "neutral" as const,
  },
];

export default function OverviewCards() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="group relative overflow-hidden rounded-2xl border border-[color:var(--brand-soft)] bg-white/90 p-4 shadow-sm transition hover:-translate-y-[1px] hover:border-[color:var(--brand)] hover:shadow-md"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-r from-[var(--brand-soft)]/50 via-[var(--brand)]/30 to-[var(--brand-soft)]/50 opacity-0 transition group-hover:opacity-100" />
          <p className="mb-2 text-xs font-medium text-slate-500">
            {card.label}
          </p>
          <p className="mb-3 text-2xl font-semibold tracking-tight text-slate-900">
            {card.value}
          </p>
          <p className="inline-flex items-center gap-1 rounded-full bg-[color:var(--brand-soft)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--brand-strong)]">
            <span
              className={
                card.tone === "positive"
                  ? "text-emerald-600"
                  : card.tone === "neutral"
                  ? "text-slate-700"
                  : "text-rose-600"
              }
            >
              {card.trend}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">{card.trendLabel}</span>
          </p>
        </article>
      ))}
    </section>
  );
}


