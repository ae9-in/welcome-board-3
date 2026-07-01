export interface Activity {
  id: string;
  slug: string;
  name: string;
  displayName: string;   // ALL CAPS — used in the massive card FitText
  image: string;
  accentColor: string;   // Per-activity accent, used only for hover ring
  bgHint: string;        // Very faint tint overlay on dark card when active
}

export const ACTIVITIES: Activity[] = [
  {
    id: "1",
    slug: "spell-bee",
    name: "SPELL BEE",
    displayName: "SPELL BEE!",
    image: "/assets/activities/spell-bee.jpg",
    accentColor: "#FF4D2E",
    bgHint: "rgba(255,77,46,0.04)",
  },
  {
    id: "2",
    slug: "handwriting",
    name: "HANDWRITING",
    displayName: "HANDWRITING!",
    image: "/assets/activities/handwriting.jpg",
    accentColor: "#4A90D9",
    bgHint: "rgba(74,144,217,0.04)",
  },
  {
    id: "3",
    slug: "ai-tech",
    name: "AI & TECH",
    displayName: "AI & TECH!",
    image: "/assets/activities/ai-tech.jpg",
    accentColor: "#00E5A0",
    bgHint: "rgba(0,229,160,0.04)",
  },
  {
    id: "4",
    slug: "math-quiz",
    name: "MATH QUIZ",
    displayName: "MATH QUIZ!",
    image: "/assets/activities/math-quiz.jpg",
    accentColor: "#F5C518",
    bgHint: "rgba(245,197,24,0.04)",
  },
  {
    id: "5",
    slug: "gk-quiz",
    name: "GK QUIZ",
    displayName: "GK QUIZ!",
    image: "/assets/activities/gk-quiz.jpg",
    accentColor: "#C77DFF",
    bgHint: "rgba(199,125,255,0.04)",
  },
  {
    id: "6",
    slug: "art-craft",
    name: "ART & CRAFT",
    displayName: "ART & CRAFT!",
    image: "/assets/activities/art-craft.jpg",
    accentColor: "#FF6B9D",
    bgHint: "rgba(255,107,157,0.04)",
  },
];
