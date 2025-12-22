import Topbar from "@/components/layout/Topbar";
import OverviewCards from "@/components/dashboard/OverviewCards";
import ActivityPanel from "@/components/dashboard/ActivityPanel";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top navigation only – no sidebar */}
      <Topbar />

      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 px-4 py-4 md:px-6 md:py-6">
          <section className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                لوحة إدارة القضايا والمستندات
              </h1>
              <p className="mt-1 max-w-xl text-[13px] text-slate-600">
                نظرة عامة على ملفات القضايا، الجلسات، المهام، وأتعاب القضايا في
                مكتبك أو إدارة الشؤون القانونية. استخدم هذه اللوحة كنقطة بداية
                لتصميم مؤشرات أداء تناسب فريقك.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                هذا الشهر
              </button>
              <button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                كل القضايا
              </button>
              <button className="rounded-full bg-gradient-to-r from-[var(--brand)] via-[var(--brand-strong)] to-[var(--brand)] px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:from-[var(--brand-strong)] hover:via-[var(--brand)] hover:to-[var(--brand-strong)]">
                تصدير التقرير
              </button>
            </div>
          </section>

          <div className="space-y-4">
            <OverviewCards />

            <section className="grid gap-4 lg:grid-cols-[2fr,1.2fr]">
              <article className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                <header className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      مراحل القضايا وحجم العمل
                    </p>
                    <p className="text-[11px] text-slate-500">
                      توزيع القضايا حسب المرحلة، مع ربطها بالمهام والمستندات
                      المرتبطة.
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 text-[10px] text-slate-600">
                      ● Draft
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 text-[10px] text-slate-600">
                      ● In review
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 text-[10px] text-slate-600">
                      ● Closed
                    </span>
                  </div>
                </header>

                <div className="mt-2 flex flex-1 flex-col justify-between gap-4">
                  <div className="h-40 rounded-xl bg-gradient-to-tr from-[var(--brand-soft)]/30 via-[var(--brand)]/20 to-[var(--brand-soft)]/30 p-3">
                    <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white/70 text-[11px] text-slate-500">
                      مساحة مخصصة لمخططات القضايا (يمكن ربطها لاحقًا بأنظمة
                      التقارير أو BI)
                    </div>
                  </div>

                  <div className="grid gap-3 text-[11px] text-slate-600 md:grid-cols-3">
                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                        قيد الإعداد
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        18 قضية
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                        منظورة أمام القضاء
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        29 قضية
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                        مغلقة / منفذة
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        17 قضية
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              <ActivityPanel />
            </section>
          </div>
      </main>
    </div>
  );
}


