"use client";

import HomeNavbar from "@/components/layout/HomeNavbar";
import { useLanguage } from "@/context/LanguageContext";
import { getHomeContent } from "@/lib/homeContent";

export default function Home() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const content = getHomeContent(isArabic);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--brand-soft)]/30 via-slate-50 to-slate-100 text-slate-900">
      <HomeNavbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-8 md:px-6 md:py-12">
        {/* Hero - law practice management focused */}
        <section className="flex flex-col gap-8 rounded-3xl border border-[var(--brand)]/30 bg-white/90 p-8 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between lg:p-10">
          <div className="max-w-xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--brand-strong)]/70">
              {content.hero.badge}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-[2.6rem]">
              {content.hero.title}
            </h1>
            <p className="text-[14px] text-slate-600 md:text-[15px]">
              {content.hero.description}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--brand)] via-[var(--brand-strong)] to-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-[var(--brand-strong)] hover:via-[var(--brand)] hover:to-[var(--brand-strong)]"
              >
                {content.hero.ctaPrimary}
              </a>
              <button className="inline-flex items-center justify-center rounded-full border border-[var(--brand)]/50 bg-white px-5 py-2.5 text-sm font-medium text-[var(--brand-strong)] shadow-sm transition hover:bg-[var(--brand-soft)]">
                {content.hero.ctaSecondary}
              </button>
              <p className="text-xs text-slate-500">
                {content.hero.note}
              </p>
            </div>
          </div>

          <div className="hidden h-full flex-1 items-center justify-center md:flex">
            <div className="relative w-full max-w-sm rounded-2xl border border-[var(--brand)]/30 bg-slate-950 p-3 shadow-xl">
              <div className="mb-2 flex items-center justify-between text-[10px] text-slate-400">
                <span>{isArabic ? "معاينة لوحة المعلومات" : "Executive dashboard preview"}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand)]/20 px-2 py-[2px] text-[9px] font-semibold text-[var(--brand)]">
                  ● {isArabic ? "متصل" : "Connected"}
                </span>
              </div>
              <div className="space-y-2 rounded-xl bg-slate-900 p-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="h-4 w-24 rounded bg-slate-700" />
                  <div className="flex gap-1">
                    <div className="h-4 w-8 rounded-full bg-slate-800" />
                    <div className="h-4 w-8 rounded-full bg-slate-800" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-12 rounded-lg bg-gradient-to-br from-[var(--brand)]/70 to-[var(--brand-strong)]/70" />
                  <div className="h-12 rounded-lg bg-slate-800" />
                  <div className="h-12 rounded-lg bg-slate-800" />
                  <div className="col-span-2 h-10 rounded-lg bg-slate-800" />
                  <div className="h-10 rounded-lg bg-slate-800" />
                </div>
                <div className="mt-1 h-12 rounded-lg bg-slate-900/80 ring-1 ring-slate-800" />
              </div>
            </div>
          </div>
        </section>

        {/* Trusted by - similar structure to Lexzur solutions pages */}
        <section className="space-y-4">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-strong)]/70">
            {content.trusted.title}
          </p>
          <div className="grid grid-cols-2 gap-3 text-center text-[11px] text-slate-500 sm:grid-cols-4 md:grid-cols-6">
            {content.trusted.items.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-dashed border-[var(--brand)]/30 bg-white/60 px-3 py-2 transition hover:border-[var(--brand)]/50 hover:bg-[var(--brand-soft)]/30"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Tailored for your practice - mirrors Lexzur "Tailored for your team" structure */}
        <section
          id="solutions"
          className="space-y-6 rounded-3xl border border-[var(--brand)]/30 bg-white/90 p-6 shadow-sm lg:p-8"
        >
          <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-strong)]/70">
                {content.solutions.badge}
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                {content.solutions.title}
              </h2>
              <p className="mt-2 max-w-2xl text-[13px] text-slate-600">
                {content.solutions.description}
              </p>
            </div>
            <button className="inline-flex w-fit items-center justify-center rounded-full border border-[var(--brand)]/50 bg-[var(--brand-soft)] px-4 py-2 text-xs font-medium text-[var(--brand-strong)] shadow-sm transition hover:bg-[var(--brand-soft)]/80">
              {content.solutions.button}
            </button>
          </header>

          <div className="grid gap-4 text-[12px] text-slate-600 md:grid-cols-3">
            {content.solutions.cards.map((card, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[var(--brand)]/30 bg-[var(--brand-soft)]/20 p-4 transition hover:border-[var(--brand)]/50 hover:bg-[var(--brand-soft)]/30"
              >
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-strong)]/70">
                  {card.title}
                </p>
                <p className="font-medium text-slate-900">{card.subtitle}</p>
                <p className="mt-1">{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform capabilities */}
        <section
          id="features"
          className="grid gap-4 text-[13px] text-slate-600 md:grid-cols-3"
        >
          {content.features.items.map((feature, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[var(--brand)]/30 bg-white/90 p-5 shadow-sm transition hover:border-[var(--brand)]/50 hover:shadow-md"
            >
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-strong)]/70">
                {feature.badge}
              </p>
              <p className="mb-1.5 text-sm font-semibold text-slate-900">
                {feature.title}
              </p>
              <p>{feature.description}</p>
            </div>
          ))}
        </section>

        {/* Integrations & security */}
        <section
          id="integrations"
          className="grid gap-4 md:grid-cols-[1.4fr,1fr]"
        >
          <div className="rounded-3xl border border-[var(--brand)]/20 bg-gradient-to-br from-slate-950 to-slate-900 px-6 py-6 text-slate-50 shadow-sm md:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--brand)]/70">
              {content.integrations.badge}
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
              {content.integrations.title}
            </h2>
            <p className="mt-2 max-w-xl text-[13px] text-slate-300">
              {content.integrations.description}
            </p>

            <div className="mt-4 grid gap-3 text-[11px] text-slate-200 sm:grid-cols-3">
              {content.integrations.items.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-900/70 p-3 ring-1 ring-[var(--brand)]/20"
                >
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 text-[12px] text-slate-600">
            <div className="rounded-2xl border border-[var(--brand)]/30 bg-white/90 p-4 shadow-sm">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-strong)]/70">
                {content.integrations.enterprise.badge}
              </p>
              <p className="font-medium text-slate-900">
                {content.integrations.enterprise.title}
              </p>
              <p className="mt-1">{content.integrations.enterprise.description}</p>
            </div>
            <div className="rounded-2xl border border-[var(--brand)]/30 bg-white/90 p-4 shadow-sm">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-strong)]/70">
                {content.integrations.global.badge}
              </p>
              <p className="font-medium text-slate-900">
                {content.integrations.global.title}
              </p>
              <p className="mt-1">{content.integrations.global.description}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
