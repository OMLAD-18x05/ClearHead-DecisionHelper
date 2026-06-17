import Navbar from "../components/layout/Navbar";
import { CriteriaPanel } from "../features/dashboard/components/CriteriaPanel";
import { DashboardHero } from "../features/dashboard/components/DashboardHero";
import { DecisionSidebar } from "../features/dashboard/components/DecisionSidebar";
import { OptionsPanel } from "../features/dashboard/components/OptionsPanel";
import { ResultsPanel } from "../features/dashboard/components/ResultsPanel";
import { ScoreMatrix } from "../features/dashboard/components/ScoreMatrix";
import { WorkspacePanel } from "../features/dashboard/components/WorkspacePanel";
import { useDashboardWorkspace } from "../features/dashboard/useDashboardWorkspace";

export default function Dashboard() {
  const workspace = useDashboardWorkspace();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(244,114,182,0.12),_transparent_26%),linear-gradient(180deg,_#07111f_0%,_#0b1424_52%,_#101827_100%)] text-slate-100">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <DashboardHero
            decisionCount={workspace.decisions.length}
            criteriaCount={workspace.criteria.length}
            optionCount={workspace.options.length}
          />

          <div className="grid gap-6 p-5 sm:p-7 xl:grid-cols-[320px_minmax(0,1fr)]">
            <DecisionSidebar
              decisions={workspace.decisions}
              selectedDecisionId={workspace.selectedDecisionId}
              isLoading={workspace.isLoading}
              isSaving={workspace.isSaving}
              decisionForm={workspace.decisionForm}
              onSelectDecision={workspace.setSelectedDecisionId}
              onDecisionFormChange={workspace.setDecisionForm}
              onCreateDecision={workspace.createDecision}
            />

            <section className="space-y-6">
              <WorkspacePanel
                selectedDecisionId={workspace.selectedDecisionId}
                selectedDecision={workspace.selectedDecision}
                selectedDecisionSummary={workspace.selectedDecisionSummary}
                criteriaCount={workspace.criteria.length}
                optionCount={workspace.options.length}
                resultCount={workspace.results.length}
                topResult={workspace.topResult}
                isSaving={workspace.isSaving}
                onDecisionChange={workspace.setSelectedDecision}
                onRefresh={workspace.refreshWorkspace}
                onUpdate={workspace.updateDecision}
                onDelete={workspace.deleteDecision}
              />

              <div className="grid gap-6 xl:grid-cols-2">
                <CriteriaPanel
                  selectedDecisionId={workspace.selectedDecisionId}
                  criteria={workspace.criteria}
                  criteriaForm={workspace.criteriaForm}
                  criteriaEdits={workspace.criteriaEdits}
                  isSaving={workspace.isSaving}
                  onCriteriaFormChange={workspace.setCriteriaForm}
                  onCriteriaEditChange={workspace.setCriteriaEdits}
                  onCreateCriteria={workspace.createCriteria}
                  onUpdateCriteria={workspace.updateCriteria}
                  onDeleteCriteria={workspace.deleteCriteria}
                />

                <OptionsPanel
                  selectedDecisionId={workspace.selectedDecisionId}
                  options={workspace.options}
                  optionForm={workspace.optionForm}
                  optionEdits={workspace.optionEdits}
                  isSaving={workspace.isSaving}
                  onOptionFormChange={workspace.setOptionForm}
                  onOptionEditChange={workspace.setOptionEdits}
                  onCreateOption={workspace.createOption}
                  onUpdateOption={workspace.updateOption}
                  onDeleteOption={workspace.deleteOption}
                />
              </div>

              <ScoreMatrix
                selectedDecisionId={workspace.selectedDecisionId}
                criteria={workspace.criteria}
                options={workspace.options}
                results={workspace.results}
                scoreDrafts={workspace.scoreDrafts}
                scoreSaveStatus={workspace.scoreSaveStatus}
                isSaving={workspace.isSaving}
                onScoreChange={workspace.updateScoreDraft}
              />

              <ResultsPanel rankedResults={workspace.rankedResults} topResult={workspace.topResult} />
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
