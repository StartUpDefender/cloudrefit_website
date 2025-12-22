const activities = [
  {
    title: "ملف قضية – نزاع تجاري",
    subtitle: "جلسة تم تحديثها · محكمة دبي",
    meta: "تم التحديث منذ 8 دقائق · فريق التقاضي",
  },
  {
    title: "مذكرة قانونية جاهزة للمراجعة",
    subtitle: "مستند · قسم الاستشارات",
    meta: "موعد التسليم خلال يومين · مستشار أول",
  },
  {
    title: "عقد تسوية – بانتظار توقيع العميل",
    subtitle: "مستند · إدارة التسويات",
    meta: "عنصر حرج · متابعة مدير المشروع",
  },
];

export default function ActivityPanel() {
  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            موجز القضايا والمستندات
          </p>
          <p className="text-[11px] text-slate-500">
            أحدث التحديثات على القضايا، الجلسات، والمستندات عبر الفرق.
          </p>
        </div>
        <button className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700 transition hover:bg-slate-100">
          View all
        </button>
      </header>

      <ul className="mt-2 space-y-2">
        {activities.map((item) => (
          <li
            key={item.title}
            className="flex items-start gap-3 rounded-xl bg-slate-50/70 px-3 py-2.5"
          >
            <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-[11px] font-semibold text-[color:var(--brand-strong)]">
              ▴
            </span>
            <div className="space-y-0.5">
              <p className="text-[13px] font-semibold text-slate-800">
                {item.title}
              </p>
              <p className="text-[11px] text-slate-500">{item.subtitle}</p>
              <p className="text-[10px] text-slate-400">{item.meta}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}


