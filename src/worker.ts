import { seedGoals } from "./data/goals";
import type { Goal } from "./data/types";

type GoalInput = {
  title: string;
  summary: string;
  theme?: string;
  clientId?: string;
};

const goalsStore: Goal[] = seedGoals.map((goal) => ({ ...goal }));

const defaultBadges = [
  { level: "easy", label: "Quick Spark", points: 20 },
  { level: "medium", label: "Momentum Builder", points: 55 },
  { level: "hard", label: "Heroic Leap", points: 110 }
] as const;

const defaultSubgoals = [
  { title: "Define the first milestone", difficulty: "easy", points: 15 },
  { title: "Schedule two practice sessions", difficulty: "medium", points: 35 },
  { title: "Share progress with a buddy", difficulty: "hard", points: 60 }
] as const;

const json = (data: unknown, init: ResponseInit = {}) =>
  Response.json(data, {
    ...init,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      ...init.headers
    }
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return json({ ok: true });
    }

    if (url.pathname === "/api/goals" && request.method === "GET") {
      return json({ goals: goalsStore });
    }

    if (url.pathname === "/api/goals" && request.method === "POST") {
      const body = (await request.json()) as GoalInput;
      if (!body?.title || !body?.summary) {
        return json({ error: "Title and summary are required." }, { status: 400 });
      }

      const newGoal: Goal = {
        id: body.clientId ?? `goal-${crypto.randomUUID()}`,
        title: body.title,
        summary: body.summary,
        theme: body.theme ?? "Personal",
        momentum: 45,
        streakWeeks: 1,
        cheers: 0,
        badges: defaultBadges.map((badge) => ({ ...badge })),
        subgoals: defaultSubgoals.map((subgoal, index) => ({
          id: `sg-${crypto.randomUUID()}-${index}`,
          title: subgoal.title,
          difficulty: subgoal.difficulty,
          points: subgoal.points
        }))
      };

      goalsStore.unshift(newGoal);
      return json({ goal: newGoal }, { status: 201 });
    }

    if (url.pathname === "/api/cheer" && request.method === "POST") {
      const body = (await request.json()) as { goalId?: string };
      const goal = goalsStore.find((item) => item.id === body.goalId);
      if (!goal) {
        return json({ error: "Goal not found." }, { status: 404 });
      }
      goal.cheers += 1;
      return json({ cheers: goal.cheers });
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    const indexRequest = new Request(new URL("/index.html", request.url), request);
    return env.ASSETS.fetch(indexRequest);
  }
};
