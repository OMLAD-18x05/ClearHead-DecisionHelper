import { memo } from "react";
import { CirclePlus, Save, Target, Trash2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import { Panel } from "./Panel";
import { DashboardField } from "./FormControls";
import { EmptyState } from "./EmptyState";

export const CriteriaPanel = memo(function CriteriaPanel({
  selectedDecisionId,
  criteria,
  criteriaForm,
  criteriaEdits,
  isSaving,
  onCriteriaFormChange,
  onCriteriaEditChange,
  onCreateCriteria,
  onUpdateCriteria,
  onDeleteCriteria,
}) {
  return (
    <Panel title="Criteria" icon={Target} badge={`${criteria.length}`}>
      {selectedDecisionId ? (
        <form className="mb-5 grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-[1fr_7rem_auto]" onSubmit={onCreateCriteria}>
          <DashboardField
            label="Criteria title"
            value={criteriaForm.title}
            onChange={(value) => onCriteriaFormChange((current) => ({ ...current, title: value }))}
            placeholder="Battery life"
            disabled={isSaving}
          />
          <DashboardField
            label="Priority"
            type="number"
            value={criteriaForm.priority}
            onChange={(value) => onCriteriaFormChange((current) => ({ ...current, priority: value }))}
            placeholder="5"
            disabled={isSaving}
          />
          <div className="flex items-end">
            <Button type="submit" className="w-full bg-white/10 text-white hover:bg-white/15" icon={CirclePlus}>
              Add
            </Button>
          </div>
        </form>
      ) : null}

      <div className="space-y-3">
        {criteria.length === 0 ? (
          <EmptyState title="No criteria yet" description="Add 3 to 6 criteria to make the score meaningful." />
        ) : (
          criteria.map((entry) => (
            <div key={entry.id} className="rounded-lg border border-white/10 bg-slate-950/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-medium text-white">{entry.title}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Priority {entry.priority}
                  </div>
                </div>
                <Target className="h-4 w-4 shrink-0 text-cyan-300" />
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="number"
                  value={criteriaEdits[entry.id] ?? entry.priority}
                  onChange={(event) =>
                    onCriteriaEditChange((current) => ({
                      ...current,
                      [entry.id]: event.target.value,
                    }))
                  }
                  disabled={isSaving}
                  className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-cyan-300/60 sm:max-w-28"
                />
                <div className="flex gap-2">
                  <Button onClick={() => onUpdateCriteria(entry.id)} loading={isSaving} className="bg-cyan-400 text-slate-950 hover:bg-cyan-300" icon={Save}>
                    Update
                  </Button>
                  <Button
                    onClick={() => onDeleteCriteria(entry.id)}
                    loading={isSaving}
                    className="border border-rose-400/20 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
                    icon={Trash2}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Panel>
  );
});
