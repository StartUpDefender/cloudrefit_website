import Topbar from "@/components/layout/Topbar";
import OverviewCards from "@/components/dashboard/OverviewCards";
import ActivityPanel from "@/components/dashboard/ActivityPanel";

export default function TopNavDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top navigation only – no sidebar */}
      <Topbar />

      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 px-4 py-4 md:px-6 md:py-6">
        <section className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
              Practice Overview (Top Nav)
            </h1>
            <p className="mt-1 max-w-xl text-[13px] text-slate-600">
              Dashboard variant that uses only a top navigation bar, similar to
              the App4Legal contacts view you shared.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
              This week
            </button>
            <button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
              All contacts
            </button>
          </div>
        </section>

        <div className="space-y-4">
          <OverviewCards />

          <section className="grid gap-4 lg:grid-cols-[1.7fr,1.1fr]">
            <article className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <header className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Contacts board
                  </p>
                  <p className="text-[11px] text-slate-500">
                    الأشخاص · الشركات · العملاء
                  </p>
                </div>
              </header>

              <div className="mt-2 overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-1 text-left text-[11px]">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="rounded-s-lg px-3 py-2 font-medium">
                        الاسم
                      </th>
                      <th className="px-3 py-2 font-medium">الفئة</th>
                      <th className="px-3 py-2 font-medium">البريد الإلكتروني</th>
                      <th className="rounded-e-lg px-3 py-2 font-medium">
                        الحالة
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="rounded-lg bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.06)]">
                      <td className="rounded-s-lg px-3 py-2 text-[11px] font-medium text-slate-900">
                        أحمد علي
                      </td>
                      <td className="px-3 py-2 text-slate-600">شخص</td>
                      <td className="px-3 py-2 text-slate-600">
                        ahmad@example.com
                      </td>
                      <td className="rounded-e-lg px-3 py-2">
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
                          نشط
                        </span>
                      </td>
                    </tr>
                    <tr className="rounded-lg bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.06)]">
                      <td className="rounded-s-lg px-3 py-2 text-[11px] font-medium text-slate-900">
                        العالمية للاتصالات
                      </td>
                      <td className="px-3 py-2 text-slate-600">شركة</td>
                      <td className="px-3 py-2 text-slate-600">
                        contact@telco.com
                      </td>
                      <td className="rounded-e-lg px-3 py-2">
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                          قيد المتابعة
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            <ActivityPanel />
          </section>
        </div>
      </main>
    </div>
  );
}


