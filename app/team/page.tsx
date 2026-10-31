import type { Metadata } from "next";
import Team from "@/components/sections/Team";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the people behind Alpha Eye Technologies.",
};

export default function TeamPage() {
  return (
    <main id="main">
      <Team />
    </main>
  );
}
