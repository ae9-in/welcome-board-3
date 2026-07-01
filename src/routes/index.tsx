import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { WhyCompetitions } from "@/components/site/WhyCompetitions";
import { CompetitionsGrid } from "@/components/site/CompetitionsGrid";
import { CreateEvent } from "@/components/site/CreateEvent";
import { Footer } from "@/components/site/Footer";
import { SectionDivider } from "@/components/effects/SectionDivider";
import { HoverActivities } from "@/components/HoverActivities";
import { getCompetitions } from "@/lib/competitions.functions";
import { fallbackCompetitions, type Competition } from "@/lib/competitions";

const LIGHT_HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Welcome Onboard — Learn, Compete, Shine" },
      {
        name: "description",
        content:
          "Six school competitions across debate, code, art, quiz, performance, and ideation. Pick yours and step on stage.",
      },
      { property: "og:title", content: "Welcome Onboard — Learn, Compete, Shine" },
      { property: "og:description", content: "Six school competitions. One stage. Step on it." },
    ],
    links: [
      { rel: "preconnect", href: "https://d8j0ntlcm91z4.cloudfront.net", crossOrigin: "anonymous" },
      {
        rel: "preload",
        as: "video",
        href: LIGHT_HERO_VIDEO,
        type: "video/mp4",
        fetchpriority: "high",
      },
    ],
  }),
  loader: async () => {
    return { competitions: fallbackCompetitions };
  },
  component: Index,
});

function Index() {
  const { competitions } = Route.useLoaderData();
  return (
    <main className="relative bg-background">
      <Navbar />
      <Hero />
      <Marquee competitions={competitions} />
      <WhyCompetitions />
      <SectionDivider />
      <CompetitionsGrid competitions={competitions} />
      <SectionDivider />
      <HoverActivities />
      <SectionDivider />
      <CreateEvent />
      <Footer />
    </main>
  );
}
