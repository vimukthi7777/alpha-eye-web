export interface NavLink {
  label: string;
  href: string;
}

export interface Social {
  label: string;
  href: string;
  icon: "facebook" | "instagram" | "whatsapp";
}

export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
}

/** One service entry inside a /service panel (icon + blurb + bullet list). */
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  bullets: string[];
}

/** A large category card on the /service page. */
export interface ServicePanelData {
  id: string;
  title: string;
  description: string;
  /** Source image, rendered as two differently cropped rounded frames. */
  image: string;
  items: ServiceItem[];
  /** Title and images on the right, list on the left (Financial Services). */
  mirrored?: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  /** Cut-out portrait (transparent PNG) shown over the card background. */
  image: string;
  /** Service categories (labels from teamFilters) used by the page filter. */
  categories: string[];
  /** Bullet list on the back of the flip card. */
  highlights: string[];
  socials: { facebook?: string; instagram?: string; x?: string };
  bio?: string;
  linkedin?: string;
}

export interface Logo {
  id: string;
  name: string;
  image: string;
  href?: string;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  quote: string;
  avatar?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category?: string;
}

