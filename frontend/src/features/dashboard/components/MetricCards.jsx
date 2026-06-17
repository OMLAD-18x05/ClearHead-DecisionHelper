export function StatCard({ label, value, icon: Icon, tone = "cyan" }) {
  const tones = {
    cyan: "text-cyan-300 bg-cyan-400/10",
    violet: "text-violet-300 bg-violet-400/10",
    rose: "text-rose-300 bg-rose-400/10",
  };

  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/45 p-4 shadow-lg shadow-slate-950/15">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</div>
          <div className="mt-2 text-2xl font-black text-white">{value}</div>
        </div>
        {Icon ? (
          <div className={`grid h-10 w-10 place-items-center rounded-lg ${tones[tone]}`}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function MiniMetric({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}
