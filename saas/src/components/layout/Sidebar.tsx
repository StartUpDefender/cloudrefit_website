export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-slate-950/95 bg-gradient-to-b from-slate-950 to-slate-900/80 px-4 py-6 text-slate-100 shadow-xl md:flex md:flex-col">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold">
          SA
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide">SaaS Dashboard</p>
          <p className="text-[11px] text-slate-400">Admin & Analytics</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 text-sm">
        <div>
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Practice overview
          </p>
          <ul className="space-y-1">
            <li>
              <button className="flex w-full items-center gap-2 rounded-md bg-slate-800/70 px-2.5 py-2 text-xs font-medium text-slate-100 ring-offset-slate-900 transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-slate-900 text-[11px]">
                  ◈
                </span>
                <span>Dashboard القضايا</span>
              </button>
            </li>
            <li>
              <button className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800/80">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-slate-700 text-[11px]">
                  ◎
                </span>
                <span>ملفات القضايا</span>
              </button>
            </li>
            <li>
              <button className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800/80">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-slate-700 text-[11px]">
                  ⌘
                </span>
                <span>القضايا النشطة</span>
              </button>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Case operations
          </p>
          <ul className="space-y-1">
            <li>
              <button className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-slate-700 text-[11px]">
                    $
                  </span>
                  <span>الفوترة وأتعاب القضايا</span>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-1.5 py-[1px] text-[10px] font-semibold text-emerald-300">
                  Live
                </span>
              </button>
            </li>
            <li>
              <button className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800/80">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-slate-700 text-[11px]">
                  ≡
                </span>
                <span>مهام ومواعيد</span>
              </button>
            </li>
            <li>
              <button className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800/80">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-slate-700 text-[11px]">
                  ☏
                </span>
                <span>المستندات والطلبات</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3 text-[11px] text-slate-300">
        <p className="mb-1.5 font-semibold text-slate-100">
          Need a custom view?
        </p>
        <p className="mb-2 text-[11px] text-slate-400">
          Configure KPIs and dashboards per department in a few clicks.
        </p>
        <button className="w-full rounded-md bg-indigo-500 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-indigo-400">
          Configure workspace
        </button>
      </div>
    </aside>
  );
}


