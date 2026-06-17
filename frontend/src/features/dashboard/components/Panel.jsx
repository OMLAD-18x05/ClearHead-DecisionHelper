
export function Panel({ title, icon: Icon, badge, actions, children }) {
    return (
        <section className="rounded-lg border border-white/10 bg-slate-950/55 p-5 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        {Icon ? <Icon className="h-5 w-5 text-cyan-300" /> : null}
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                    </div>
                    {badge ? <div className="mt-2 text-xs uppercase tracking-[0.28em] text-slate-500">{badge}</div> : null}
                </div>
                {actions ? <div className="flex flex-wrap justify-end gap-2">{actions}</div> : null}
            </div>
            {children}
        </section>
    );
}
