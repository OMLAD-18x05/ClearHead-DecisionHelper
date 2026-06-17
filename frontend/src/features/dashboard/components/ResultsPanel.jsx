import { memo } from "react";
import { TrendingUp } from "lucide-react";
import { Panel } from "./Panel";
import { EmptyState } from "./EmptyState";

export const ResultsPanel = memo(function ResultsPanel({ rankedResults, topResult }) {
  return (
    <Panel title="Results" icon={TrendingUp} badge={topResult ? "Live ranking" : "Ready"}>
      {rankedResults.length > 0 ? (
        <div className="space-y-4">
          {rankedResults.map((entry, index) => (
            <div key={`${entry.option}-${index}`} className="rounded-lg border border-white/10 bg-slate-950/65 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Rank {index + 1}</div>
                  <div className="mt-1 text-lg font-semibold text-white">{entry.option}</div>
                </div>
                <div className="text-2xl font-black text-cyan-300">{Number(entry.score).toFixed(2)}</div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400"
                  style={{ width: `${Math.min(100, Math.max(6, entry.score * 10))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No results yet" description="Save some option scores and the ranking will appear here." />
      )}
    </Panel>
  );
});
