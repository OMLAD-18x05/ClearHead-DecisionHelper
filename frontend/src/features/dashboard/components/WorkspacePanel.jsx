import { memo } from "react";
import { Flame, RefreshCcw, Save, Trash2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import { Panel } from "./Panel";
import { DashboardField, DashboardTextarea } from "./FormControls";
import { EmptyState } from "./EmptyState";
import { MiniMetric } from "./MetricCards";

export const WorkspacePanel = memo(function WorkspacePanel({
  selectedDecisionId,
  selectedDecision,
  selectedDecisionSummary,
  criteriaCount,
  optionCount,
  resultCount,
  topResult,
  isSaving,
  onDecisionChange,
  onRefresh,
  onUpdate,
  onDelete,
}) {
  return (
    <Panel
      title={selectedDecisionSummary ? selectedDecisionSummary.title : "Select a decision"}
      icon={Flame}
      badge={selectedDecisionSummary ? `ID ${selectedDecisionSummary.id}` : "Workspace"}
      actions={
        selectedDecisionId ? (
          <div className="flex flex-wrap gap-2">
            <Button onClick={onRefresh} className="border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10" icon={RefreshCcw}>
              Refresh
            </Button>
            <Button onClick={onUpdate} loading={isSaving} className="bg-cyan-400 text-slate-950 hover:bg-cyan-300" icon={Save}>
              Update
            </Button>
            <Button
              onClick={onDelete}
              loading={isSaving}
              className="border border-rose-400/20 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
              icon={Trash2}
            >
              Delete
            </Button>
          </div>
        ) : null
      }
    >
      {selectedDecision ? (
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <DashboardField
              label="Decision title"
              value={selectedDecision.title}
              onChange={(value) => onDecisionChange((current) => ({ ...current, title: value }))}
              disabled={isSaving}
            />
            <DashboardTextarea
              label="Decision description"
              value={selectedDecision.description}
              onChange={(value) => onDecisionChange((current) => ({ ...current, description: value }))}
              disabled={isSaving}
              rows={5}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <MiniMetric label="Best option" value={topResult ? topResult.option : "No scores"} />
            <MiniMetric label="Result rows" value={`${resultCount}`} />
            <MiniMetric label="Criteria" value={`${criteriaCount}`} />
            <MiniMetric label="Options" value={`${optionCount}`} />
          </div>
        </div>
      ) : (
        <EmptyState title="Pick a decision" description="Select an item on the left or create a new one to open the workspace." />
      )}
    </Panel>
  );
});
