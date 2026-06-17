import { memo } from "react";
import { ArrowRight, CirclePlus, ClipboardList, Save } from "lucide-react";
import Button from "../../../components/ui/Button";
import { Panel } from "./Panel";
import { DashboardField, DashboardTextarea } from "./FormControls";
import { EmptyState } from "./EmptyState";

export const DecisionSidebar = memo(function DecisionSidebar({
  decisions,
  selectedDecisionId,
  isLoading,
  isSaving,
  decisionForm,
  onSelectDecision,
  onDecisionFormChange,
  onCreateDecision,
}) {
  return (
    <aside className="space-y-5">
      <Panel title="Your decisions" icon={ClipboardList} badge={`${decisions.length}`}>
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-20 animate-pulse rounded-lg bg-white/5" />
            <div className="h-20 animate-pulse rounded-lg bg-white/5" />
          </div>
        ) : decisions.length === 0 ? (
          <EmptyState title="No decisions yet" description="Create your first one and start structuring the trade-offs." />
        ) : (
          <div className="space-y-3">
            {decisions.map((decision) => (
              <DecisionListItem
                key={decision.id}
                decision={decision}
                isActive={decision.id === selectedDecisionId}
                onClick={() => onSelectDecision(decision.id)}
              />
            ))}
          </div>
        )}
      </Panel>

      <Panel title="Create decision" icon={CirclePlus} badge="New">
        <form className="space-y-4" onSubmit={onCreateDecision}>
          <DashboardField
            label="Title"
            value={decisionForm.title}
            onChange={(value) => onDecisionFormChange((current) => ({ ...current, title: value }))}
            placeholder="Choose a laptop"
            disabled={isSaving}
          />
          <DashboardTextarea
            label="Description"
            value={decisionForm.description}
            onChange={(value) => onDecisionFormChange((current) => ({ ...current, description: value }))}
            placeholder="Compare battery, portability, price, and support."
            disabled={isSaving}
          />
          <Button
            type="submit"
            fullWidth
            loading={isSaving}
            className="gradient-bg-hover text-white shadow-lg shadow-indigo-950/30"
            icon={Save}
          >
            Save decision
          </Button>
        </form>
      </Panel>
    </aside>
  );
});

const DecisionListItem = memo(function DecisionListItem({ decision, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-lg border p-4 text-left transition-all duration-300 ${
        isActive
          ? "border-cyan-300/60 bg-cyan-300/10 shadow-lg shadow-cyan-950/20"
          : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-semibold text-white">{decision.title}</div>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-400">{decision.description}</p>
        </div>
        <ArrowRight
          className={`mt-1 h-4 w-4 shrink-0 transition ${
            isActive ? "text-cyan-200" : "text-slate-500 group-hover:text-slate-300"
          }`}
        />
      </div>
    </button>
  );
});
