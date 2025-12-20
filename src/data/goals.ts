import type { Goal } from "./types";

export const seedGoals: Goal[] = [
  {
    id: "aurora-steps",
    title: "Aurora Fitness Quest",
    summary: "Train for a dawn hike series with escalating stamina milestones.",
    theme: "Movement",
    momentum: 72,
    streakWeeks: 6,
    cheers: 14,
    badges: [
      { level: "easy", label: "5k Sunrise Loop", points: 40 },
      { level: "medium", label: "10k Ridge Run", points: 80 },
      { level: "hard", label: "Summit Night Trek", points: 140 }
    ],
    subgoals: [
      { id: "aurora-1", title: "Log 3 mobility sessions", difficulty: "easy", points: 20 },
      { id: "aurora-2", title: "Complete a 7k trail walk", difficulty: "medium", points: 45 },
      { id: "aurora-3", title: "Carry a weighted pack for 60 min", difficulty: "hard", points: 75 }
    ]
  },
  {
    id: "atlas-reading",
    title: "Atlas Knowledge Atlas",
    summary: "Read across continents and catalog insights each month.",
    theme: "Learning",
    momentum: 63,
    streakWeeks: 4,
    cheers: 9,
    badges: [
      { level: "easy", label: "4 Book Orbit", points: 30 },
      { level: "medium", label: "8 Book Galaxy", points: 70 },
      { level: "hard", label: "12 Book Nebula", points: 120 }
    ],
    subgoals: [
      { id: "atlas-1", title: "Pick 3 regions to explore", difficulty: "easy", points: 15 },
      { id: "atlas-2", title: "Write two 1-page summaries", difficulty: "medium", points: 35 },
      { id: "atlas-3", title: "Host a mini book salon", difficulty: "hard", points: 65 }
    ]
  },
  {
    id: "harmony-kitchen",
    title: "Harmony Kitchen",
    summary: "Master nourishing meals with seasonal produce and tracking.",
    theme: "Wellness",
    momentum: 58,
    streakWeeks: 5,
    cheers: 11,
    badges: [
      { level: "easy", label: "3 Meal Prep Wins", points: 35 },
      { level: "medium", label: "Zero Waste Week", points: 75 },
      { level: "hard", label: "Host a Community Brunch", points: 130 }
    ],
    subgoals: [
      { id: "harmony-1", title: "Craft a seasonal menu", difficulty: "easy", points: 20 },
      { id: "harmony-2", title: "Cook 5 plant-forward meals", difficulty: "medium", points: 45 },
      { id: "harmony-3", title: "Teach a family recipe", difficulty: "hard", points: 80 }
    ]
  },
  {
    id: "pulse-focus",
    title: "Pulse Focus Deep Work",
    summary: "Build a daily deep work rhythm with focus analytics.",
    theme: "Productivity",
    momentum: 81,
    streakWeeks: 8,
    cheers: 22,
    badges: [
      { level: "easy", label: "7 Focus Sprints", points: 50 },
      { level: "medium", label: "15 Flow Sessions", points: 90 },
      { level: "hard", label: "30-Day Focus Streak", points: 150 }
    ],
    subgoals: [
      { id: "pulse-1", title: "Design a focus ritual", difficulty: "easy", points: 25 },
      { id: "pulse-2", title: "Track distractions for 1 week", difficulty: "medium", points: 40 },
      { id: "pulse-3", title: "Complete a 3-hour deep work block", difficulty: "hard", points: 85 }
    ]
  },
  {
    id: "nova-savings",
    title: "Nova Savings Vault",
    summary: "Gamify saving for dream trips with weekly challenges.",
    theme: "Finance",
    momentum: 67,
    streakWeeks: 7,
    cheers: 18,
    badges: [
      { level: "easy", label: "$250 Buffer", points: 45 },
      { level: "medium", label: "$1K Milestone", points: 85 },
      { level: "hard", label: "$3K Launchpad", points: 145 }
    ],
    subgoals: [
      { id: "nova-1", title: "Automate a weekly transfer", difficulty: "easy", points: 20 },
      { id: "nova-2", title: "Complete a no-spend weekend", difficulty: "medium", points: 40 },
      { id: "nova-3", title: "Negotiate a recurring bill", difficulty: "hard", points: 70 }
    ]
  },
  {
    id: "spark-community",
    title: "Spark Community Builder",
    summary: "Grow a supportive network with intentional outreach.",
    theme: "Community",
    momentum: 54,
    streakWeeks: 3,
    cheers: 7,
    badges: [
      { level: "easy", label: "3 Kind Notes", points: 25 },
      { level: "medium", label: "Host a Roundtable", points: 65 },
      { level: "hard", label: "Launch a Monthly Meetup", points: 120 }
    ],
    subgoals: [
      { id: "spark-1", title: "Invite 2 friends to coffee", difficulty: "easy", points: 15 },
      { id: "spark-2", title: "Plan a group activity", difficulty: "medium", points: 35 },
      { id: "spark-3", title: "Volunteer for a local event", difficulty: "hard", points: 70 }
    ]
  },
  {
    id: "orbit-learning",
    title: "Orbit Skill Tree",
    summary: "Develop a new skill with layered practice quests.",
    theme: "Skill",
    momentum: 76,
    streakWeeks: 6,
    cheers: 16,
    badges: [
      { level: "easy", label: "5 Practice Sessions", points: 35 },
      { level: "medium", label: "Ship a Demo", points: 80 },
      { level: "hard", label: "Teach a Workshop", points: 135 }
    ],
    subgoals: [
      { id: "orbit-1", title: "Create a 30-day plan", difficulty: "easy", points: 20 },
      { id: "orbit-2", title: "Record 3 practice reflections", difficulty: "medium", points: 40 },
      { id: "orbit-3", title: "Publish a portfolio piece", difficulty: "hard", points: 75 }
    ]
  },
  {
    id: "lumen-mindfulness",
    title: "Lumen Mindfulness Garden",
    summary: "Design a calming routine with mindful checkpoints.",
    theme: "Mindfulness",
    momentum: 61,
    streakWeeks: 4,
    cheers: 12,
    badges: [
      { level: "easy", label: "7 Guided Sessions", points: 30 },
      { level: "medium", label: "14 Day Calm Chain", points: 70 },
      { level: "hard", label: "30 Day Quiet Loop", points: 120 }
    ],
    subgoals: [
      { id: "lumen-1", title: "Create a daily 5-min ritual", difficulty: "easy", points: 15 },
      { id: "lumen-2", title: "Try three breath techniques", difficulty: "medium", points: 35 },
      { id: "lumen-3", title: "Complete a silent hour", difficulty: "hard", points: 65 }
    ]
  },
  {
    id: "ember-creativity",
    title: "Ember Creative Archive",
    summary: "Capture creative sparks and publish monthly collections.",
    theme: "Creativity",
    momentum: 69,
    streakWeeks: 5,
    cheers: 15,
    badges: [
      { level: "easy", label: "10 Idea Cards", points: 30 },
      { level: "medium", label: "Monthly Zine", points: 75 },
      { level: "hard", label: "Gallery Night", points: 130 }
    ],
    subgoals: [
      { id: "ember-1", title: "Sketch daily for 10 minutes", difficulty: "easy", points: 20 },
      { id: "ember-2", title: "Share a weekly progress post", difficulty: "medium", points: 40 },
      { id: "ember-3", title: "Collaborate on a project", difficulty: "hard", points: 70 }
    ]
  },
  {
    id: "zenith-travel",
    title: "Zenith Adventure Map",
    summary: "Plan 2026 adventures with mini-challenges and journaling.",
    theme: "Adventure",
    momentum: 52,
    streakWeeks: 2,
    cheers: 10,
    badges: [
      { level: "easy", label: "3 Local Escapes", points: 25 },
      { level: "medium", label: "1 International Trip", points: 80 },
      { level: "hard", label: "Adventure Documentary", points: 140 }
    ],
    subgoals: [
      { id: "zenith-1", title: "Map 5 dream destinations", difficulty: "easy", points: 15 },
      { id: "zenith-2", title: "Book a micro-adventure", difficulty: "medium", points: 40 },
      { id: "zenith-3", title: "Publish a travel recap video", difficulty: "hard", points: 90 }
    ]
  }
];
