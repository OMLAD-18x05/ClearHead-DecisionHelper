import { memo } from "react";
import { BarChart3 } from "lucide-react";
import { Panel } from "./Panel";
import { EmptyState } from "./EmptyState";

export const ScoreMatrix = memo(function ScoreMatrix({
  selectedDecisionId,
  criteria,
  options,
  results,
  scoreDrafts,
  scoreSaveStatus,
  isSaving,
  onScoreChange,
}) {
  return (
    <Panel title="Score matrix" icon={BarChart3} badge={`${results.length} rows`}>
      {selectedDecisionId ? (
        criteria.length > 0 && options.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  <th className="px-3 py-2">Option</th>
                  {criteria.map((entry) => (
                    <th key={entry.id} className="px-3 py-2">
                      {entry.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {options.map((option) => (
                  <tr key={option.id}>
                    <td className="px-3 py-2">
                      <div className="min-w-40 rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 font-medium text-white">
                        {option.title}
                      </div>
                    </td>
                    {criteria.map((entry) => {
                      const draftKey = `${option.id}-${entry.id}`;
                      return (
                        <ScoreCell
                          key={entry.id}
                          optionId={option.id}
                          criteriaId={entry.id}
                          value={scoreDrafts[draftKey] ?? ""}
                          status={scoreSaveStatus[draftKey]}
                          disabled={isSaving}
                          onScoreChange={onScoreChange}
                        />
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="Add criteria and options first" description="The score grid appears after both lists have at least one item." />
        )
      ) : (
        <EmptyState title="No active decision" description="Pick a decision to enter and compare scores." />
      )}
    </Panel>
  );
});

const ScoreCell = memo(function ScoreCell({
  optionId,
  criteriaId,
  value,
  status,
  disabled,
  onScoreChange,
}) {
  return (
    <td className="px-3 py-2">
      <div className="min-w-36 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 transition focus-within:border-cyan-300/60 focus-within:ring-4 focus-within:ring-cyan-400/10">
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={value}
          onChange={(event) => onScoreChange(optionId, criteriaId, event.target.value)}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          placeholder="0-10"
          disabled={disabled}
        />
        <ScoreStatus status={status} />
      </div>
    </td>
  );
});

const ScoreStatus = memo(function ScoreStatus({ status }) {
  const labels = {
    pending: "Editing...",
    saving: "Saving...",
    saved: "Saved",
    invalid: "Enter a number",
    error: "Retrying on edit",
  };

  if (!status || status === "idle") return <div className="mt-1 h-4" />;

  return (
    <div
      className={`mt-1 h-4 text-[0.68rem] font-medium ${
        status === "saved"
          ? "text-emerald-300"
          : status === "invalid" || status === "error"
            ? "text-rose-300"
            : "text-slate-400"
      }`}
    >
      {labels[status]}
    </div>
  );
});
