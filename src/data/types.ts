export type BadgeLevel = "easy" | "medium" | "hard";

export type Badge = {
  level: BadgeLevel;
  label: string;
  points: number;
};

export type Subgoal = {
  id: string;
  title: string;
  difficulty: BadgeLevel;
  points: number;
};

export type Goal = {
  id: string;
  title: string;
  summary: string;
  theme: string;
  momentum: number;
  streakWeeks: number;
  cheers: number;
  badges: Badge[];
  subgoals: Subgoal[];
};
