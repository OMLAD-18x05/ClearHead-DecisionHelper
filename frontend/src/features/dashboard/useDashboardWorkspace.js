import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/Toast";
import { emptyCriteria, emptyDecision, emptyOption } from "./constants";

export function useDashboardWorkspace() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [decisions, setDecisions] = useState([]);
  const [selectedDecisionId, setSelectedDecisionId] = useState(null);
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [criteria, setCriteria] = useState([]);
  const [matrixCriteria, setMatrixCriteria] = useState([]);
  const [options, setOptions] = useState([]);
  const [results, setResults] = useState([]);
  const [criteriaEdits, setCriteriaEdits] = useState({});
  const [optionEdits, setOptionEdits] = useState({});
  const [decisionForm, setDecisionForm] = useState(emptyDecision);
  const [criteriaForm, setCriteriaForm] = useState(emptyCriteria);
  const [optionForm, setOptionForm] = useState(emptyOption);
  const [scoreDrafts, setScoreDrafts] = useState({});
  const [scoreSaveStatus, setScoreSaveStatus] = useState({});
  const [criteriaSavingIds, setCriteriaSavingIds] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Per-panel busy flags to prevent cross-panel re-renders
  const [criteriaBusy, setCriteriaBusy] = useState(false);
  const [optionsBusy, setOptionsBusy] = useState(false);
  const [decisionBusy, setDecisionBusy] = useState(false);

  const scoreSaveTimers = useRef({});

  const selectedDecisionSummary = useMemo(() => {
    if (!selectedDecision) return null;
    return {
      title: selectedDecision.title,
      description: selectedDecision.description,
      id: selectedDecisionId,
    };
  }, [selectedDecision, selectedDecisionId]);

  const topResult = useMemo(() => {
    if (results.length === 0) return null;
    return [...results].sort((left, right) => right.score - left.score)[0];
  }, [results]);

  const rankedResults = useMemo(
    () => [...results].sort((left, right) => right.score - left.score),
    [results]
  );

  const resetWorkspace = useCallback(() => {
    setSelectedDecision(null);
    setCriteria([]);
    setMatrixCriteria([]);
    setOptions([]);
    setResults([]);
    setCriteriaEdits({});
    setOptionEdits({});
    setScoreDrafts({});
    setScoreSaveStatus({});
  }, []);

  const loadDecisions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/decisions");
      const ordered = [...response.data].sort(
        (left, right) => new Date(right.createdAt) - new Date(left.createdAt)
      );
      setDecisions(ordered);

      if (ordered.length > 0) {
        setSelectedDecisionId((current) => {
          const stillExists = ordered.some((decision) => decision.id === current);
          return stillExists ? current : ordered[0].id;
        });
      } else {
        setSelectedDecisionId(null);
        resetWorkspace();
      }
    } catch (error) {
      showToast(error.response?.data?.msg || "Unable to load decisions", "error");
    } finally {
      setIsLoading(false);
    }
  }, [resetWorkspace, showToast]);

  const loadWorkspace = useCallback(
    async (decisionId) => {
      try {
        const [decisionResponse, criteriaResponse, optionsResponse, resultResponse, scoresResponse] = await Promise.all([
          api.get(`/api/decisions/${decisionId}`),
          api.get(`/api/decisions/${decisionId}/criteria`),
          api.get(`/api/decisions/${decisionId}/options`),
          api.get(`/api/decisions/${decisionId}/result`),
          api.get(`/api/decisions/${decisionId}/scores`),
        ]);

        setSelectedDecision({
          id: decisionId,
          title: decisionResponse.data.title,
          description: decisionResponse.data.description,
        });
        setCriteria(criteriaResponse.data);
        setMatrixCriteria(criteriaResponse.data.map(({ id, title }) => ({ id, title })));
        setOptions(optionsResponse.data);
        setResults(resultResponse.data);
        setCriteriaEdits(
          Object.fromEntries(criteriaResponse.data.map((entry) => [entry.id, String(entry.priority)]))
        );
        setOptionEdits(Object.fromEntries(optionsResponse.data.map((entry) => [entry.id, entry.title])));
        setScoreDrafts(
          Object.fromEntries(
            scoresResponse.data.map((s) => [`${s.option_id}-${s.criteria_id}`, String(s.value)])
          )
        );
        setScoreSaveStatus({});
      } catch (error) {
        showToast(error.response?.data?.msg || "Unable to load decision workspace", "error");
      }
    },
    [showToast]
  );

  const loadResults = useCallback(async (decisionId) => {
    const resultResponse = await api.get(`/api/decisions/${decisionId}/result`);
    setResults(resultResponse.data);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, navigate, user]);

  useEffect(() => {
    if (!authLoading && user) {
      const timer = window.setTimeout(() => {
        void loadDecisions();
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [authLoading, loadDecisions, user]);

  useEffect(() => {
    if (selectedDecisionId) {
      const timer = window.setTimeout(() => {
        void loadWorkspace(selectedDecisionId);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [loadWorkspace, selectedDecisionId]);

  useEffect(() => {
    return () => {
      Object.values(scoreSaveTimers.current).forEach((timer) => window.clearTimeout(timer));
      scoreSaveTimers.current = {};
    };
  }, [selectedDecisionId]);

  const refreshWorkspace = useCallback(async () => {
    if (selectedDecisionId) {
      await loadWorkspace(selectedDecisionId);
      await loadDecisions();
    }
  }, [loadDecisions, loadWorkspace, selectedDecisionId]);

  const createDecision = useCallback(async (event) => {
    event.preventDefault();
    if (!decisionForm.title.trim() || !decisionForm.description.trim()) {
      showToast("Add a title and description first", "warning");
      return;
    }

    setDecisionBusy(true);
    try {
      const response = await api.post("/api/decisions", {
        title: decisionForm.title.trim(),
        description: decisionForm.description.trim(),
      });
      setDecisionForm(emptyDecision);
      showToast("Decision created", "success");
      await loadDecisions();
      if (response.data?.decision?.id) {
        setSelectedDecisionId(response.data.decision.id);
      }
    } catch (error) {
      showToast(error.response?.data?.msg || "Unable to create decision", "error");
    } finally {
      setDecisionBusy(false);
    }
  }, [decisionForm, loadDecisions, showToast]);

  const updateDecision = useCallback(async () => {
    if (!selectedDecisionId || !selectedDecision) return;
    setDecisionBusy(true);
    try {
      await api.patch(`/api/decisions/${selectedDecisionId}`, {
        title: selectedDecision.title,
        description: selectedDecision.description,
      });
      showToast("Decision updated", "success");
      await loadDecisions();
    } catch (error) {
      showToast(error.response?.data?.msg || "Unable to update decision", "error");
    } finally {
      setDecisionBusy(false);
    }
  }, [loadDecisions, selectedDecision, selectedDecisionId, showToast]);

  const deleteDecision = useCallback(async () => {
    if (!selectedDecisionId) return;

    const confirmed = window.confirm("Delete this decision and all of its data?");
    if (!confirmed) return;

    setDecisionBusy(true);
    try {
      await api.delete(`/api/decisions/${selectedDecisionId}`);
      showToast("Decision deleted", "success");
      await loadDecisions();
    } catch (error) {
      showToast(error.response?.data?.msg || "Unable to delete decision", "error");
    } finally {
      setDecisionBusy(false);
    }
  }, [loadDecisions, selectedDecisionId, showToast]);

  // ── Criteria CRUD (targeted updates, no refreshWorkspace) ──

  const createCriteria = useCallback(async (event) => {
    event.preventDefault();
    if (!selectedDecisionId) return;
    if (!criteriaForm.title.trim() || !criteriaForm.priority) {
      showToast("Add criteria title and priority", "warning");
      return;
    }

    setCriteriaBusy(true);
    try {
      const response = await api.post(`/api/decisions/${selectedDecisionId}/criteria`, {
        title: criteriaForm.title,
        priority: Number(criteriaForm.priority),
      });
      const newEntry = {
        id: response.data.criteriaId,
        title: criteriaForm.title,
        priority: Number(criteriaForm.priority),
        decision_id: selectedDecisionId,
      };
      setCriteria((current) => [...current, newEntry]);
      setMatrixCriteria((current) => [...current, { id: newEntry.id, title: newEntry.title }]);
      setCriteriaEdits((current) => ({ ...current, [newEntry.id]: String(newEntry.priority) }));
      setCriteriaForm(emptyCriteria);
      showToast("Criteria added", "success");
    } catch (error) {
      showToast(error.response?.data?.msg || "Unable to add criteria", "error");
    } finally {
      setCriteriaBusy(false);
    }
  }, [criteriaForm, selectedDecisionId, showToast]);

  const updateCriteria = useCallback(async (criteriaId) => {
    if (!selectedDecisionId) return;
    const nextPriority = Number(criteriaEdits[criteriaId]);

    if (!Number.isFinite(nextPriority)) {
      showToast("Priority must be a number", "warning");
      return;
    }

    setCriteriaSavingIds((current) => ({ ...current, [criteriaId]: true }));
    try {
      await api.put(`/api/decisions/${selectedDecisionId}/criteria/${criteriaId}`, {
        priority: nextPriority,
      });
      setCriteria((current) =>
        current.map((entry) =>
          entry.id === criteriaId ? { ...entry, priority: nextPriority } : entry
        )
      );
      showToast("Criteria updated", "success");
      await loadResults(selectedDecisionId);
    } catch (error) {
      showToast(error.response?.data?.msg || "Unable to update criteria", "error");
    } finally {
      setCriteriaSavingIds((current) => {
        const next = { ...current };
        delete next[criteriaId];
        return next;
      });
    }
  }, [criteriaEdits, loadResults, selectedDecisionId, showToast]);

  const deleteCriteria = useCallback(async (criteriaId) => {
    if (!selectedDecisionId) return;

    const confirmed = window.confirm("Delete this criteria?");
    if (!confirmed) return;

    setCriteriaBusy(true);
    try {
      await api.delete(`/api/decisions/${selectedDecisionId}/criteria/${criteriaId}`);
      setCriteria((current) => current.filter((entry) => entry.id !== criteriaId));
      setMatrixCriteria((current) => current.filter((entry) => entry.id !== criteriaId));
      setCriteriaEdits((current) => {
        const next = { ...current };
        delete next[criteriaId];
        return next;
      });
      // Remove score drafts for this criteria
      setScoreDrafts((current) => {
        const next = {};
        for (const [key, value] of Object.entries(current)) {
          if (!key.endsWith(`-${criteriaId}`)) next[key] = value;
        }
        return next;
      });
      showToast("Criteria deleted", "success");
      await loadResults(selectedDecisionId);
    } catch (error) {
      showToast(error.response?.data?.msg || "Unable to delete criteria", "error");
    } finally {
      setCriteriaBusy(false);
    }
  }, [loadResults, selectedDecisionId, showToast]);

  // ── Options CRUD (targeted updates, no refreshWorkspace) ──

  const createOption = useCallback(async (event) => {
    event.preventDefault();
    if (!selectedDecisionId) return;
    if (!optionForm.title.trim()) {
      showToast("Add an option title", "warning");
      return;
    }

    setOptionsBusy(true);
    try {
      const response = await api.post(`/api/decisions/${selectedDecisionId}/options`, optionForm);
      // Fetch latest options to get the new entry with its id
      const optionsResponse = await api.get(`/api/decisions/${selectedDecisionId}/options`);
      setOptions(optionsResponse.data);
      setOptionEdits(Object.fromEntries(optionsResponse.data.map((entry) => [entry.id, entry.title])));
      setOptionForm(emptyOption);
      showToast("Option added", "success");
    } catch (error) {
      showToast(error.response?.data?.msg || "Unable to add option", "error");
    } finally {
      setOptionsBusy(false);
    }
  }, [optionForm, selectedDecisionId, showToast]);

  const updateOption = useCallback(async (optionId) => {
    if (!selectedDecisionId) return;
    const nextTitle = optionEdits[optionId]?.trim();

    if (!nextTitle) {
      showToast("Option title cannot be empty", "warning");
      return;
    }

    setOptionsBusy(true);
    try {
      await api.patch(`/api/decisions/${selectedDecisionId}/options/${optionId}`, {
        title: nextTitle,
      });
      setOptions((current) =>
        current.map((entry) =>
          entry.id === optionId ? { ...entry, title: nextTitle } : entry
        )
      );
      showToast("Option updated", "success");
      await loadResults(selectedDecisionId);
    } catch (error) {
      showToast(error.response?.data?.msg || "Unable to update option", "error");
    } finally {
      setOptionsBusy(false);
    }
  }, [optionEdits, loadResults, selectedDecisionId, showToast]);

  const deleteOption = useCallback(async (optionId) => {
    if (!selectedDecisionId) return;

    const confirmed = window.confirm("Delete this option?");
    if (!confirmed) return;

    setOptionsBusy(true);
    try {
      await api.delete(`/api/decisions/${selectedDecisionId}/options/${optionId}`);
      setOptions((current) => current.filter((entry) => entry.id !== optionId));
      setOptionEdits((current) => {
        const next = { ...current };
        delete next[optionId];
        return next;
      });
      // Remove score drafts for this option
      setScoreDrafts((current) => {
        const next = {};
        for (const [key, value] of Object.entries(current)) {
          if (!key.startsWith(`${optionId}-`)) next[key] = value;
        }
        return next;
      });
      showToast("Option deleted", "success");
      await loadResults(selectedDecisionId);
    } catch (error) {
      showToast(error.response?.data?.msg || "Unable to delete option", "error");
    } finally {
      setOptionsBusy(false);
    }
  }, [loadResults, selectedDecisionId, showToast]);

  const saveScoreValue = useCallback(async (optionId, criteriaId, rawValue, draftKey) => {
    if (!selectedDecisionId) return;
    const scoreValue = Number(rawValue);

    if (!Number.isFinite(scoreValue)) {
      setScoreSaveStatus((current) => ({ ...current, [draftKey]: "invalid" }));
      return;
    }

    setScoreSaveStatus((current) => ({ ...current, [draftKey]: "saving" }));
    try {
      await api.post(`/api/decisions/${selectedDecisionId}/result`, {
        option_id: optionId,
        criteria_id: criteriaId,
        value: scoreValue,
      });
      await loadResults(selectedDecisionId);
      setScoreSaveStatus((current) => ({ ...current, [draftKey]: "saved" }));
    } catch (error) {
      setScoreSaveStatus((current) => ({ ...current, [draftKey]: "error" }));
      showToast(error.response?.data?.msg || "Unable to save score", "error");
    }
  }, [loadResults, selectedDecisionId, showToast]);

  const updateScoreDraft = useCallback((optionId, criteriaId, value) => {
    const draftKey = `${optionId}-${criteriaId}`;

    setScoreDrafts((current) => ({
      ...current,
      [draftKey]: value,
    }));

    if (scoreSaveTimers.current[draftKey]) {
      window.clearTimeout(scoreSaveTimers.current[draftKey]);
    }

    if (value === "") {
      setScoreSaveStatus((current) => ({ ...current, [draftKey]: "idle" }));
      return;
    }

    setScoreSaveStatus((current) => ({ ...current, [draftKey]: "pending" }));
    scoreSaveTimers.current[draftKey] = window.setTimeout(() => {
      void saveScoreValue(optionId, criteriaId, value, draftKey);
    }, 550);
  }, [saveScoreValue]);

  return {
    decisions,
    selectedDecisionId,
    selectedDecision,
    selectedDecisionSummary,
    criteria,
    matrixCriteria,
    options,
    results,
    rankedResults,
    topResult,
    criteriaEdits,
    optionEdits,
    decisionForm,
    criteriaForm,
    optionForm,
    scoreDrafts,
    scoreSaveStatus,
    criteriaSavingIds,
    isLoading,
    criteriaBusy,
    optionsBusy,
    decisionBusy,
    setSelectedDecisionId,
    setSelectedDecision,
    setCriteriaEdits,
    setOptionEdits,
    setDecisionForm,
    setCriteriaForm,
    setOptionForm,
    refreshWorkspace,
    createDecision,
    updateDecision,
    deleteDecision,
    createCriteria,
    updateCriteria,
    deleteCriteria,
    createOption,
    updateOption,
    deleteOption,
    updateScoreDraft,
  };
}
