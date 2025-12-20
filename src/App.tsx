import {
  useActionState,
  useDeferredValue,
  useId,
  useMemo,
  useOptimistic,
  useState,
  useTransition
} from "react";
import "./styles/app.css";

type Lesson = {
  id: string;
  title: string;
  summary: string;
  tag: string;
};

type FormState = {
  status: "idle" | "saving" | "success" | "error";
  message: string;
};

type OptimisticLessonAction = {
  type: "add";
  lesson: Lesson;
};

const initialLessons: Lesson[] = [
  {
    id: "lesson-1",
    title: "Async UI Actions",
    summary: "Handle forms with server-like mutations and instant feedback.",
    tag: "useActionState"
  },
  {
    id: "lesson-2",
    title: "Optimistic Lists",
    summary: "Show updates immediately while work finishes in the background.",
    tag: "useOptimistic"
  },
  {
    id: "lesson-3",
    title: "Concurrent Filtering",
    summary: "Keep typing responsive while the UI recalculates results.",
    tag: "useTransition"
  },
  {
    id: "lesson-4",
    title: "Stable Form IDs",
    summary: "Generate consistent IDs for accessible labels and controls.",
    tag: "useId"
  }
];

const formInitialState: FormState = {
  status: "idle",
  message: ""
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function App() {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [isPending, startTransition] = useTransition();

  const [optimisticLessons, addOptimisticLesson] = useOptimistic(
    lessons,
    (state: Lesson[], action: OptimisticLessonAction) => {
      if (state.some((lesson) => lesson.id === action.lesson.id)) {
        return state;
      }
      return [action.lesson, ...state];
    }
  );

  const [formState, formAction, isSaving] = useActionState(
    async (_prevState: FormState, formData: FormData): Promise<FormState> => {
      const title = String(formData.get("title") ?? "").trim();
      const summary = String(formData.get("summary") ?? "").trim();
      const tag = String(formData.get("tag") ?? "").trim();

      if (!title || !summary) {
        return { status: "error", message: "Add a title and summary to create a lesson." };
      }

      const newLesson: Lesson = {
        id: `lesson-${crypto.randomUUID()}`,
        title,
        summary,
        tag: tag || "React 19"
      };

      addOptimisticLesson({ type: "add", lesson: newLesson });

      await wait(800);
      setLessons((prev) => [newLesson, ...prev]);

      return { status: "success", message: "Lesson added to the demo catalog." };
    },
    formInitialState
  );

  const filteredLessons = useMemo(() => {
    if (!deferredQuery) {
      return optimisticLessons;
    }

    const lowered = deferredQuery.toLowerCase();
    return optimisticLessons.filter((lesson) =>
      [lesson.title, lesson.summary, lesson.tag].some((value) =>
        value.toLowerCase().includes(lowered)
      )
    );
  }, [deferredQuery, optimisticLessons]);

  const titleId = useId();
  const summaryId = useId();
  const tagId = useId();
  const searchId = useId();

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">React 19 Feature Studio</p>
          <h1>Explore the new React 19 primitives through tiny, live demos.</h1>
          <p className="subtitle">
            Each card below demonstrates a React 19 feature, plus a short explanation to make the
            behavior easy to teach in a workshop or classroom.
          </p>
        </div>
        <div className="hero-card">
          <div>
            <p className="hero-label">Lessons</p>
            <p className="hero-metric">{optimisticLessons.length}</p>
            <p className="hero-note">Interactive examples in the catalog</p>
          </div>
          <div>
            <p className="hero-label">Filtered</p>
            <p className="hero-metric">{filteredLessons.length}</p>
            <p className="hero-note">Matches for the current search</p>
          </div>
        </div>
      </header>

      <section className="demo-grid">
        <article className="demo-card">
          <header>
            <h2>Action State + Forms</h2>
            <span className={`status-chip ${formState.status}`}>{formState.message || "Idle"}</span>
          </header>
          <p className="muted">
            This demo uses <strong>useActionState</strong> to run async form logic without manual
            loading flags. React manages the pending and result state so the UI can show a clear
            status message as the action resolves.
          </p>
          <form className="lesson-form" action={formAction}>
            <label htmlFor={titleId}>Lesson title</label>
            <input id={titleId} name="title" placeholder="Example: Form Actions" />
            <label htmlFor={summaryId}>Summary</label>
            <textarea
              id={summaryId}
              name="summary"
              rows={3}
              placeholder="Describe the lesson in one sentence"
            />
            <label htmlFor={tagId}>Tag</label>
            <input id={tagId} name="tag" placeholder="React 19" />
            <button className="primary" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Add lesson"}
            </button>
          </form>
        </article>

        <article className="demo-card">
          <header>
            <h2>Optimistic UI</h2>
            <span className="pill">useOptimistic</span>
          </header>
          <p className="muted">
            The list below renders from <strong>useOptimistic</strong>, so new lessons appear
            instantly even while the simulated save runs. When the save finishes, the real state
            catches up automatically.
          </p>
          <ul className="lesson-list">
            {optimisticLessons.slice(0, 5).map((lesson) => (
              <li key={lesson.id}>
                <div>
                  <p className="lesson-title">{lesson.title}</p>
                  <p className="muted">{lesson.summary}</p>
                </div>
                <span className="pill">{lesson.tag}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="demo-card">
          <header>
            <h2>Deferred Search</h2>
            <span className="pill">useDeferredValue</span>
          </header>
          <p className="muted">
            Typing updates the input immediately, but the expensive filter waits for the deferred
            value. This keeps typing smooth when lists are large, while showing a “Filtering...”
            indicator via <strong>useTransition</strong>.
          </p>
          <div className="search">
            <label className="sr-only" htmlFor={searchId}>
              Search lessons
            </label>
            <input
              id={searchId}
              value={query}
              onChange={(event) => startTransition(() => setQuery(event.target.value))}
              placeholder="Search lessons"
            />
            {isPending && <span className="pending">Filtering...</span>}
          </div>
          <div className="result-count">
            Showing {filteredLessons.length} / {optimisticLessons.length} lessons
          </div>
        </article>

        <article className="demo-card">
          <header>
            <h2>Accessible IDs</h2>
            <span className="pill">useId</span>
          </header>
          <p className="muted">
            React 19 keeps <strong>useId</strong> stable across server and client rendering. That
            means labels and inputs stay correctly linked without manual ID bookkeeping, making
            forms more accessible by default.
          </p>
          <div className="id-preview">
            <div>
              <p className="hero-label">Generated IDs</p>
              <p className="mono">{titleId}</p>
              <p className="mono">{summaryId}</p>
              <p className="mono">{tagId}</p>
            </div>
            <div>
              <p className="hero-label">Current search</p>
              <p className="mono">{deferredQuery || "No query yet"}</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
