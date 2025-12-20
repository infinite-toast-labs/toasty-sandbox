import {
  useActionState,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useOptimistic,
  useReducer,
  useState,
  useTransition
} from "react";
import type { Goal, Subgoal } from "./data/types";
import "./styles/app.css";

type FormState = {
  status: "idle" | "saving" | "success" | "error";
  message: string;
};

type CompletionAction =
  | { type: "toggle"; goalId: string; subgoalId: string }
  | { type: "reset"; goalId: string };

type CompletionState = Record<string, Record<string, boolean>>;

type OptimisticAction = { type: "add"; goal: Goal };

const formInitialState: FormState = {
  status: "idle",
  message: ""
};

const completionReducer = (state: CompletionState, action: CompletionAction): CompletionState => {
  switch (action.type) {
    case "toggle": {
      const goalState = state[action.goalId] ?? {};
      return {
        ...state,
        [action.goalId]: {
          ...goalState,
          [action.subgoalId]: !goalState[action.subgoalId]
        }
      };
    }
    case "reset": {
      const updated = { ...state };
      delete updated[action.goalId];
      return updated;
    }
  }
};

const createOptimisticGoal = (id: string, title: string, summary: string): Goal => ({
  id,
  title,
  summary,
  theme: "Custom",
  momentum: 42,
  streakWeeks: 1,
  cheers: 0,
  badges: [
    { level: "easy", label: "Fresh Start", points: 20 },
    { level: "medium", label: "Momentum Rise", points: 55 },
    { level: "hard", label: "Legend Status", points: 120 }
  ],
  subgoals: [
    { id: `opt-${crypto.randomUUID()}-1`, title: "Name the first milestone", difficulty: "easy", points: 15 },
    { id: `opt-${crypto.randomUUID()}-2`, title: "Schedule a practice block", difficulty: "medium", points: 35 },
    { id: `opt-${crypto.randomUUID()}-3`, title: "Celebrate a small win", difficulty: "hard", points: 55 }
  ]
});

export default function App() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [isPending, startTransition] = useTransition();
  const [completionState, dispatchCompletion] = useReducer(completionReducer, {});

  const [optimisticGoals, addOptimisticGoal] = useOptimistic(
    goals,
    (state: Goal[], action: OptimisticAction): Goal[] => {
      if (state.some((goal) => goal.id === action.goal.id)) {
        return state;
      }
      return [action.goal, ...state];
    }
  );

  const [formState, formAction, isSaving] = useActionState(
    async (_prevState: FormState, formData: FormData): Promise<FormState> => {
      const title = String(formData.get("title") ?? "").trim();
      const summary = String(formData.get("summary") ?? "").trim();
      const theme = String(formData.get("theme") ?? "").trim();

      if (!title || !summary) {
        return { status: "error", message: "Add a title and summary to launch a goal." };
      }

      const clientId = `goal-${crypto.randomUUID()}`;
      const optimistic = createOptimisticGoal(clientId, title, summary);
      addOptimisticGoal({ type: "add", goal: optimistic });

      try {
        const response = await fetch("/api/goals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, summary, theme: theme || undefined, clientId })
        });

        if (!response.ok) {
          throw new Error("Failed to save goal.");
        }

        const data = (await response.json()) as { goal: Goal };
        setGoals((prev) => [data.goal, ...prev]);
        return { status: "success", message: "Goal added to your 2026 library." };
      } catch {
        return { status: "error", message: "Could not save goal. Try again soon." };
      }
    },
    formInitialState
  );

  const loadGoals = async () => {
    const response = await fetch("/api/goals");
    const data = (await response.json()) as { goals: Goal[] };
    setGoals(data.goals);
  };

  useEffect(() => {
    void loadGoals();
  }, []);

  const toggleExpand = (goalId: string) => {
    setExpandedGoals((prev) => {
      const next = new Set(prev);
      if (next.has(goalId)) {
        next.delete(goalId);
      } else {
        next.add(goalId);
      }
      return next;
    });
  };

  const handleCheer = async (goalId: string) => {
    const response = await fetch("/api/cheer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalId })
    });

    if (response.ok) {
      const data = (await response.json()) as { cheers: number };
      setGoals((prev) =>
        prev.map((goal) => (goal.id === goalId ? { ...goal, cheers: data.cheers } : goal))
      );
    }
  };

  const visibleGoals = useMemo(() => {
    if (!deferredQuery) {
      return optimisticGoals;
    }

    const lowered = deferredQuery.toLowerCase();
    return optimisticGoals.filter((goal) =>
      [goal.title, goal.summary, goal.theme].some((text) => text.toLowerCase().includes(lowered))
    );
  }, [deferredQuery, optimisticGoals]);

  const totalPoints = useMemo(() => {
    return optimisticGoals.reduce((total, goal) => {
      const completed = completionState[goal.id] ?? {};
      const points = goal.subgoals.reduce((sum, subgoal) => {
        return completed[subgoal.id] ? sum + subgoal.points : sum;
      }, 0);
      return total + points;
    }, 0);
  }, [completionState, optimisticGoals]);

  const missionId = useId();

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">GoalForge 2026 Library</p>
          <h1>Level up your New Year with a gamified goal archive.</h1>
          <p className="subtitle">
            Track momentum, unlock badges, and reveal quest subgoals for every challenge you
            choose.
          </p>
        </div>
        <div className="hero-card">
          <div>
            <p className="hero-label">Total XP</p>
            <p className="hero-metric">{totalPoints}</p>
            <p className="hero-note">From completed subgoals</p>
          </div>
          <div>
            <p className="hero-label">Active Goals</p>
            <p className="hero-metric">{optimisticGoals.length}</p>
            <p className="hero-note">Curated for 2026</p>
          </div>
        </div>
      </header>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Launch a new goal</h2>
            <p className="muted">Add a fresh quest and auto-generate starter subgoals.</p>
          </div>
          <span className={`status-chip ${formState.status}`}>{formState.message}</span>
        </div>

        <form className="goal-form" action={formAction}>
          <label htmlFor={missionId}>Goal title</label>
          <input id={missionId} name="title" placeholder="Ex: Build a sunrise run habit" />
          <label htmlFor={`${missionId}-summary`}>Goal summary</label>
          <textarea
            id={`${missionId}-summary`}
            name="summary"
            placeholder="Describe the motivation and reward"
            rows={3}
          />
          <label htmlFor={`${missionId}-theme`}>Theme</label>
          <input id={`${missionId}-theme`} name="theme" placeholder="Movement, Learning, Creativity" />
          <button className="primary" type="submit" disabled={isSaving}>
            {isSaving ? "Launching..." : "Launch goal"}
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>2026 Goal Library</h2>
            <p className="muted">Tap a goal to reveal subgoals, badges, and progress tools.</p>
          </div>
          <div className="search">
            <input
              value={query}
              onChange={(event) => startTransition(() => setQuery(event.target.value))}
              placeholder="Search goals"
              aria-label="Search goals"
            />
            {isPending && <span className="pending">Refreshing...</span>}
          </div>
        </div>

        <div className="goal-grid">
          {visibleGoals.map((goal) => {
            const isExpanded = expandedGoals.has(goal.id);
            const completion = completionState[goal.id] ?? {};
            const completedCount = Object.values(completion).filter(Boolean).length;
            return (
              <article key={goal.id} className="goal-card">
                <header>
                  <div>
                    <p className="tag">{goal.theme}</p>
                    <h3>{goal.title}</h3>
                    <p className="muted">{goal.summary}</p>
                  </div>
                  <button className="ghost" onClick={() => toggleExpand(goal.id)} type="button">
                    {isExpanded ? "Hide details" : "Reveal details"}
                  </button>
                </header>

                <div className="goal-meta">
                  <div>
                    <p className="hero-label">Momentum</p>
                    <p className="hero-metric">{goal.momentum}%</p>
                  </div>
                  <div>
                    <p className="hero-label">Streak</p>
                    <p className="hero-metric">{goal.streakWeeks} wks</p>
                  </div>
                  <div>
                    <p className="hero-label">Cheers</p>
                    <p className="hero-metric">{goal.cheers}</p>
                  </div>
                </div>

                <div className="badge-row">
                  {goal.badges.map((badge) => (
                    <span key={badge.label} className={`badge ${badge.level}`}>
                      {badge.label} · {badge.points} XP
                    </span>
                  ))}
                </div>

                {isExpanded && (
                  <div className="goal-details">
                    <div className="subgoal-list">
                      {goal.subgoals.map((subgoal) => (
                        <SubgoalItem
                          key={subgoal.id}
                          goalId={goal.id}
                          subgoal={subgoal}
                          isComplete={completion[subgoal.id] ?? false}
                          onToggle={() =>
                            dispatchCompletion({ type: "toggle", goalId: goal.id, subgoalId: subgoal.id })
                          }
                        />
                      ))}
                    </div>
                    <div className="goal-actions">
                      <button className="ghost" type="button" onClick={() => handleCheer(goal.id)}>
                        Send cheer 🎉
                      </button>
                      <button
                        className="ghost"
                        type="button"
                        onClick={() => dispatchCompletion({ type: "reset", goalId: goal.id })}
                      >
                        Reset subgoals
                      </button>
                      <p className="muted">Completed {completedCount} / {goal.subgoals.length}</p>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

type SubgoalProps = {
  goalId: string;
  subgoal: Subgoal;
  isComplete: boolean;
  onToggle: () => void;
};

function SubgoalItem({ subgoal, isComplete, onToggle }: SubgoalProps) {
  return (
    <label className={`subgoal ${isComplete ? "complete" : ""}`}>
      <input type="checkbox" checked={isComplete} onChange={onToggle} />
      <div>
        <p>{subgoal.title}</p>
        <span className={`chip ${subgoal.difficulty}`}>
          {subgoal.difficulty} · {subgoal.points} XP
        </span>
      </div>
    </label>
  );
}
