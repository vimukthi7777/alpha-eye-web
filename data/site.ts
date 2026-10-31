import type { NavLink, Social } from "./types";

export const site = {
  name: "Alpha Eye",
  tagline: "Technologies",
  description:
    "Creatives driven by the desire to bring your vision to life, with a blend of artistic flair of brands than ever before.",
  email: "alphaeye@gmail.com",
  // TODO(client): mockup shows two different numbers (contact: 71 272 7145, footer: 71 123 1234).
  phone: "(+94) 71 272 7145",
  address: "123, Nuwara Eliya",
  handle: "@AlphaEye",
  logo: "/images/logo/logo.svg",
  logoWithName: "/images/logo/logoWithName.svg",
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Service", href: "/service" },
  { label: "Portfolio", href: "/#work" },
  { label: "Team", href: "/team" },
  { label: "About us", href: "/#about" },
  { label: "Contact us", href: "/#contact" },
];

export const footerPages: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/service" },
  { label: "Portfolio", href: "/#work" },
  { label: "Team", href: "/team" },
  { label: "About us", href: "/#about" },
  { label: "Contact us", href: "/#contact" },
];

export const socials: Social[] = [
  { label: "Facebook", href: "https://facebook.com/alphaeye", icon: "facebook" },
  { label: "Instagram", href: "https://instagram.com/alphaeye", icon: "instagram" },
  { label: "WhatsApp", href: "https://wa.me/94712727145", icon: "whatsapp" },
];
