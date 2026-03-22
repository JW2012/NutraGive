export type FoodRequest = {
  id: string;
  name: string;
  title: string;
  description: string;
  amount: number;
  tags: string[];
  feeds: { people: number; weeks: number };
};

export const REQUESTS: FoodRequest[] = [
  {
    id: "1",
    name: "Maria G.",
    title: "Groceries for my three kids",
    description: "I'm a single mother and we've run out of food. I need help buying basic staples — rice, beans, vegetables, and bread — to get through the week.",
    amount: 80,
    tags: ["children", "single parent", "urgent"],
    feeds: { people: 4, weeks: 1 },
  },
  {
    id: "2",
    name: "James T.",
    title: "Food while I look for work",
    description: "I was laid off last month and my savings are gone. Just need enough to cover meals while I get back on my feet.",
    amount: 60,
    tags: ["adult", "unemployed"],
    feeds: { people: 1, weeks: 2 },
  },
  {
    id: "3",
    name: "Aisha K.",
    title: "Baby formula and healthy food",
    description: "My baby is 8 months old and I can't afford formula right now. Any help to keep her fed and healthy would mean everything to me.",
    amount: 50,
    tags: ["infant", "children", "urgent"],
    feeds: { people: 2, weeks: 1 },
  },
  {
    id: "4",
    name: "Carlos M.",
    title: "Nutritious meals for my elderly parents",
    description: "I care for my aging parents and money has been very tight. They need proper nutrition and I can't always make it work on my own.",
    amount: 100,
    tags: ["elderly", "caregiver"],
    feeds: { people: 3, weeks: 2 },
  },
  {
    id: "5",
    name: "Fatima O.",
    title: "Groceries after medical bills",
    description: "A recent hospital stay wiped out our budget. My family needs food while we recover financially.",
    amount: 90,
    tags: ["family", "medical"],
    feeds: { people: 5, weeks: 1 },
  },
  {
    id: "6",
    name: "David L.",
    title: "Food for my kids during school break",
    description: "School lunches are the only guaranteed meal for my kids. With break coming up, I need help keeping them fed.",
    amount: 70,
    tags: ["children", "school break"],
    feeds: { people: 3, weeks: 2 },
  },
];
