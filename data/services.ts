import type { Service, ServicePanelData } from "./types";

const ICONS = "/images/services/pageAssets/icon";

export const servicesIntro = {
  heading: "Top Service Solutions",
  paragraph:
    "Our main services are designed to elevate your business through expert solutions in web design, branding, digital marketing, and development. We tailor each service to meet your specific needs.",
  cta: { label: "View More Services", href: "/service" },
};

export const services: Service[] = [
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    description: "Campaigns and social strategy that turn attention into growth.",
    image: "/images/services/digital_marketing.svg",
    icon: "megaphone",
    features: ["Social Media Marketing", "Paid Campaigns", "SEO"],
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "Modern, responsive websites for businesses.",
    image: "/images/services/web_development.svg",
    icon: "code",
    features: ["Business Websites", "E-commerce Development", "Custom Web Applications"],
  },
  {
    id: "content-creation",
    title: "Content Creation",
    description: "Photography, video and copy that tell your brand story.",
    image: "/images/services/content_creation.svg",
    icon: "camera",
    features: ["Photography", "Video Production", "Copywriting"],
  },
  {
    id: "branding-solutions",
    title: "Branding Solutions",
    description: "Identities and visual systems that make brands memorable.",
    image: "/images/services/branding_solutions.svg",
    icon: "palette",
    features: ["Logo Design", "Brand Identity", "Brand Guidelines"],
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    description: "Intuitive digital experiences designed around your users.",
    // TODO: replace with a dedicated UI/UX image (temporary reuse).
    image: "/images/services/web_development.svg",
    icon: "layout",
    features: ["Wireframes", "Prototypes", "Design Systems"],
  },
];

/* ---------------------------- /service page ---------------------------- */

export const servicesPageHero = {
  heading: "Services",
  /** Pills per swipeable page on mobile. */
  mobilePageSize: 4,
  paragraph:
    "Creatives driven by the desire to bring your vision to life. With a blend of artistic flair and technical expertise, people expect more of brands than ever before. Innovate and create at the possible growth solutions.",
};

/** Hero pills, in two columns as in the mockup. `target` is a service item id. */
export const servicesPageLinks = {
  left: [
    { label: "Web Development", target: "web-development" },
    { label: "Digital Marketing", target: "digital-marketing" },
    { label: "IT Consultation", target: "it-consultation" },
    { label: "Printing Solutions", target: "printing-solutions" },
    { label: "POS & CCTV Systems", target: "pos-cctv-systems" },
  ],
  right: [
    { label: "Creative Design & Branding", target: "creative-design-branding" },
    { label: "Photography & Videography", target: "photography-videography" },
    { label: "Video Production & Animation", target: "video-production-animation" },
    { label: "Accounting Management", target: "accounting-financial-management" },
    { label: "Social Media Management", target: "social-media-management" },
  ],
};

/** Landing-page service ids that have no item of their own on /service. */
export const serviceAnchors: Record<string, string> = {
  "content-creation": "photography-videography",
  "branding-solutions": "creative-design-branding",
  "ui-ux-design": "creative-design-branding",
};

export const servicePanels: ServicePanelData[] = [
  {
    id: "digital-solutions",
    title: "Digital Solutions",
    description: "Technology driven services for your online presence and digital growth.",
    image: "/images/services/pageAssets/digital-solution-img1.jpg",
    items: [
      {
        id: "web-development",
        title: "Web Development",
        description: "Custom, mobile-optimized websites with advanced integrations.",
        icon: `${ICONS}/web-evelopment-icon.svg`,
        bullets: [
          "Booking engines integration",
          "OTA (Online Travel Agency) systems",
          "Mobile-responsive design",
          "E-commerce functionality",
        ],
      },
      {
        id: "digital-marketing",
        title: "Digital Marketing",
        description: "Comprehensive online visibility solutions to grow your audience.",
        icon: `${ICONS}/digital-marketing-icon.svg`,
        bullets: [
          "Search Engine Optimization (SEO)",
          "Google Ads campaigns",
          "Social media marketing",
          "Influencer collaborations",
        ],
      },
      {
        id: "social-media-management",
        title: "Social Media Management",
        description: "Platform-specific growth strategies and content creation.",
        icon: `${ICONS}/social-media-management-icon.svg`,
        bullets: [
          "Content strategy development",
          "Reels/Shorts creation",
          "Audience engagement",
          "Platform growth services",
        ],
      },
    ],
  },
  {
    id: "creative-services",
    title: "Creative Services",
    description: "Visual and branding solutions to make your business stand out.",
    image: "/images/services/pageAssets/creative-service-img1.jpg",
    items: [
      {
        id: "creative-design-branding",
        title: "Creative Design & Branding",
        description: "Comprehensive visual identity development.",
        icon: `${ICONS}/creative-design-icon.svg`,
        bullets: [
          "Logo design",
          "Marketing materials (flyers, brochures)",
          "Business cards",
          "Complete brand identity",
        ],
      },
      {
        id: "photography-videography",
        title: "Photography & Videography",
        description: "Professional media production for all needs.",
        icon: `${ICONS}/photography-icon.svg`,
        bullets: [
          "Product photography",
          "Event coverage",
          "Lifestyle and fashion shoots",
          "Corporate video production",
        ],
      },
      {
        id: "video-production-animation",
        title: "Video Production & Animation",
        description: "Advanced video solutions for impactful storytelling.",
        icon: `${ICONS}/video-production-icon.svg`,
        bullets: [
          "Full-service video editing",
          "2D & 3D animation",
          "360° immersive content",
          "Aerial filming with drones",
        ],
      },
      {
        id: "printing-solutions",
        title: "Printing Solutions",
        description: "Physical branding materials and promotional items.",
        icon: `${ICONS}/printing-icon.svg`,
        bullets: [
          "Banners and signage",
          "Apparel printing (t-shirts, etc.)",
          "Promotional products (mugs, etc.)",
          "ID cards and photo prints",
        ],
      },
    ],
  },
  {
    id: "financial-services",
    title: "Financial Services",
    description: "Specialized financial management for business growth and compliance.",
    image: "/images/services/pageAssets/financial-service-img-1.jpg",
    mirrored: true,
    items: [
      {
        id: "accounting-financial-management",
        title: "Accounting & Financial Management",
        description: "Tailored financial solutions for businesses.",
        icon: `${ICONS}/accounting-icon.svg`,
        bullets: [
          "SME accounting services",
          "Payroll management",
          "Taxation services",
          "Hotel finance specialization",
        ],
      },
    ],
  },
  {
    id: "business-systems",
    title: "Business Systems",
    // TODO(client): copy for this panel is not in the mockup; placeholder text.
    description: "Reliable technology and point-of-sale solutions to keep your business running.",
    image: "/images/services/pageAssets/business-system-img1.jpg",
    items: [
      {
        id: "it-consultation",
        title: "IT Consultation",
        description: "Expert guidance to plan, secure and scale your technology.",
        icon: `${ICONS}/it-consultation-icon.svg`,
        bullets: [
          "IT infrastructure planning",
          "Software and hardware advice",
          "Network setup and support",
          "Digital transformation",
        ],
      },
      {
        id: "pos-cctv-systems",
        title: "POS & CCTV Systems",
        description: "Point-of-sale and security systems installed and supported end to end.",
        icon: `${ICONS}/pos-%20cctv-systems-icon.svg`,
        bullets: [
          "POS hardware and software",
          "Billing and inventory setup",
          "CCTV installation",
          "Maintenance and support",
        ],
      },
    ],
  },
];
