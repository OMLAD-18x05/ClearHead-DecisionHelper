import { memo } from "react";
import { CirclePlus, Save, Trash2, TrendingUp } from "lucide-react";
import Button from "../../../components/ui/Button";
import { Panel } from "./Panel";
import { DashboardField } from "./FormControls";
import { EmptyState } from "./EmptyState";

export const OptionsPanel = memo(function OptionsPanel({
  selectedDecisionId,
  options,
  optionForm,
  optionEdits,
  isSaving,
  onOptionFormChange,
  onOptionEditChange,
  onCreateOption,
  onUpdateOption,
  onDeleteOption,
}) {
  return (
    <Panel title="Options" icon={TrendingUp} badge={`${options.length}`}>
      {selectedDecisionId ? (
        <form className="mb-5 grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-[1fr_auto]" onSubmit={onCreateOption}>
          <DashboardField
            label="Option title"
            value={optionForm.title}
            onChange={(value) => onOptionFormChange((current) => ({ ...current, title: value }))}
            placeholder="MacBook Air"
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
        {options.length === 0 ? (
          <EmptyState title="No options yet" description="Add the choices you want to compare." />
        ) : (
          options.map((entry) => (
            <div key={entry.id} className="rounded-lg border border-white/10 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="truncate font-medium text-white">{entry.title}</div>
                <TrendingUp className="h-4 w-4 shrink-0 text-fuchsia-300" />
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={optionEdits[entry.id] ?? entry.title}
                  onChange={(event) =>
                    onOptionEditChange((current) => ({
                      ...current,
                      [entry.id]: event.target.value,
                    }))
                  }
                  disabled={isSaving}
                  className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-cyan-300/60"
                />
                <div className="flex gap-2">
                  <Button onClick={() => onUpdateOption(entry.id)} loading={isSaving} className="bg-cyan-400 text-slate-950 hover:bg-cyan-300" icon={Save}>
                    Update
                  </Button>
                  <Button
                    onClick={() => onDeleteOption(entry.id)}
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
