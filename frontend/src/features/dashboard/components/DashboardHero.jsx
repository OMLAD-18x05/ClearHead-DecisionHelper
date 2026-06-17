import { memo } from "react";
import { Brain, ClipboardList, Target, TrendingUp } from "lucide-react";
import { StatCard } from "./MetricCards";

export const DashboardHero = memo(function DashboardHero({ decisionCount, criteriaCount, optionCount }) {
  return (
    <div className="flex flex-col gap-6 border-b border-white/10 px-5 py-6 sm:px-7 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
          <Brain className="h-4 w-4" />
          Decision workspace
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
          Compare the trade-offs without losing the plot.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Create a decision, rank the criteria, add the options, and score the matrix from one focused dashboard.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[28rem]">
        <StatCard label="Decisions" value={decisionCount} icon={ClipboardList} tone="cyan" />
        <StatCard label="Criteria" value={criteriaCount} icon={Target} tone="violet" />
        <StatCard label="Options" value={optionCount} icon={TrendingUp} tone="rose" />
      </div>
    </div>
  );
});
