import type { Project } from "./types";

export const projectsIntro = {
  heading: "Our Latest Work",
  cta: { label: "Gallery", href: "/gallery" },
};

export const projects: Project[] = [
  {
    id: "overland-website",
    title: "Overland - Website",
    category: "Web Development",
    description: "A modern website built for Overland Automobiles.",
    image: "/images/projects/Project1.svg",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    liveUrl: "#",
  },
  {
    id: "overland-social-media",
    title: "Overland - Social Media",
    category: "Digital Marketing",
    description: "Social media creatives for Overland Automobiles.",
    image: "/images/projects/Project2.svg",
    technologies: ["Social Media", "Content Creation"],
    liveUrl: "#",
  },
];
