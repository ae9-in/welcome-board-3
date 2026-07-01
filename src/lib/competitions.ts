export type Competition = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  full_description: string | null;
  image_url: string | null;
  icon: string | null;
  sort_order: number;
};

export const fallbackCompetitions: Competition[] = [
  {
    id: "1",
    slug: "spell-bee",
    title: "Spell Bee",
    short_description: "Battle of letters and vocabulary under pressure. Speak fast, spell right.",
    full_description:
      "A classic high-stakes spelling bee designed to challenge vocabulary, pronunciation, and rapid recall under pressure. Competitors face off in progressive rounds, testing their linguistic limits as the difficulty increases. Open to all students who love the power of words.",
    image_url: "/assets/competitions/spell-bee.png",
    icon: "spell-check",
    sort_order: 1,
  },
  {
    id: "2",
    slug: "handwriting",
    title: "Handwriting",
    short_description: "The elegance of ink and precision on paper. Precision in every stroke.",
    full_description:
      "A celebration of ink, form, and precision. Judged on legibility, uniformity, spacing, and stroke flow, this competition invites participants to bring patience and artistry to the page in cursive or print format.",
    image_url: "/assets/competitions/handwriting.png",
    icon: "pen-tool",
    sort_order: 2,
  },
  {
    id: "3",
    slug: "ai-tech",
    title: "AI & Tech",
    short_description: "Build, code, or prompt the future. Let machines meet your mind.",
    full_description:
      "Step into the digital arena where technology meets creativity. Build rapid prototypes, solve algorithmic challenges, or engineer precise prompts for generative AI models to solve real-world tasks.",
    image_url: "/assets/competitions/ai-tech.png",
    icon: "cpu",
    sort_order: 3,
  },
  {
    id: "4",
    slug: "math-quiz",
    title: "Math Quiz",
    short_description: "Race against the clock to solve the unsolvable. Pure logic and speed.",
    full_description:
      "A rapid-fire mathematical challenge designed to test mental agility, logic, and speed. Face timed arithmetic sprints, geometry puzzles, and word problems without calculators—just raw intellectual grit.",
    image_url: "/assets/competitions/math-quiz.png",
    icon: "binary",
    sort_order: 4,
  },
  {
    id: "5",
    slug: "gk-quiz",
    title: "GK Quiz",
    short_description: "Prove your knowledge of everything from history to pop culture.",
    full_description:
      "A fast-paced trivia tournament spanning history, science, geography, sports, and current affairs. Designed for the insatiably curious, it rewards quick reflexes and deep general knowledge.",
    image_url: "/assets/competitions/gk-quiz.png",
    icon: "globe",
    sort_order: 5,
  },
  {
    id: "6",
    slug: "art-craft",
    title: "Art & Craft",
    short_description: "Translate imagination into physical form with tactile creativity.",
    full_description:
      "An open-medium visual challenge that rewards physical and digital craftsmanship. Responding to a surprise theme, create a painting, model, or sculpture using standard tools and creative imagination.",
    image_url: "/assets/competitions/art-craft.png",
    icon: "palette",
    sort_order: 6,
  },
];

export const competitionGradient: Record<string, string> = {
  "spell-bee": "linear-gradient(135deg, #1f140d 0%, #523b18 100%)",
  handwriting: "linear-gradient(135deg, #1c1c1c 0%, #3a3a3a 100%)",
  "ai-tech": "linear-gradient(135deg, #091a2e 0%, #153b6b 100%)",
  "math-quiz": "linear-gradient(135deg, #1e0f2b 0%, #462261 100%)",
  "gk-quiz": "linear-gradient(135deg, #1a2a1a 0%, #2f5c3f 100%)",
  "art-craft": "linear-gradient(135deg, #2b131c 0%, #612c3f 100%)",
};
