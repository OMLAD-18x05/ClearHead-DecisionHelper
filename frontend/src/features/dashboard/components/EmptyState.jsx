export function EmptyState({ title, description }) {
  return (
    <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.03] px-5 py-8 text-center">
      <div className="text-base font-semibold text-white">{title}</div>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}
