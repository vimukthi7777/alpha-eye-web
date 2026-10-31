import type { TeamMember } from "./types";

/** Filter pills on /team, in display order. Member `categories` must use these labels. */
export const teamFilters = [
  "Web Development",
  "Digital Marketing",
  "Creative Design & Branding",
  "Photography & Videography",
  "Social Media Management",
  "Video Production & Animation",
  "Accounting Management",
  "IT Consultation",
];

export const teamPage = {
  heading: "Team",
  paragraph:
    "Creatives driven by the desire to bring your vision to life. With a blend of artistic flair and technical expertise, people expect more of brands than ever before. Innovate and create at the possible growth solutions.",
  allLabel: "All",
  /** Pills (including All) always visible; the rest sit behind the filter button. */
  visibleCount: 5,
  /** Pills (including All) in the row on mobile: All + Web Development. */
  mobileVisibleCount: 2,
  filterOpenLabel: "More solutions",
  filterCloseLabel: "Close filters",
  filterPanelTitle: "Filter by solution",
  empty: "No team members in this category yet.",
  cursorLabel: "Click to details",
  flipLabel: "Show details for",
  detailsLabel: "View profile",
  backLabel: "Back to team",
  contactLabel: "Book a Call",
};

// TODO(client): social links and Sahan's highlights are placeholders.
const placeholderSocials = {
  facebook: "https://facebook.com/alphaeye",
  instagram: "https://instagram.com/alphaeye",
  x: "https://x.com/alphaeye",
};

/** Contact form link that preselects this member in the Team dropdown. */
export const teamContactHref = (id: string) => `/?team=${id}#contact`;

export const teamDetailsHref = (id: string) => `/team/${id}`;

export const team: TeamMember[] = [
  {
    id: "suren-gunaratne",
    name: "Suren Gunaratne",
    role: "Director",
    image: "/images/team/Suren Gunaratne.png",
    categories: ["Web Development", "Digital Marketing", "IT Consultation"],
    highlights: [
      "AI & Digital Transformation Consultant",
      "Software Developer",
      "Digital Marketing Strategist",
    ],
    socials: placeholderSocials,
  },
  {
    id: "sahan-vimukthi",
    name: "Sahan Vimukthi",
    role: "Designer & Developer",
    image: "/images/team/Sahan Vimukthi.png",
    categories: ["Web Development", "Creative Design & Branding"],
    highlights: ["UI/UX & Brand Designer", "Web Developer", "Creative Problem Solver"],
    socials: placeholderSocials,
  },
];
