import type { Metadata } from "next";
import ServicesHero from "@/components/sections/ServicesHero";
import ServicePanel from "@/components/sections/ServicePanel";
import Contact from "@/components/sections/Contact";
import { servicePanels } from "@/data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web development, digital marketing, branding, photography, video, printing, accounting and business systems from Alpha Eye Technologies.",
};

export default function ServicePage() {
  return (
    <main id="main">
      <ServicesHero />
      {servicePanels.map((panel) => (
        <ServicePanel key={panel.id} panel={panel} />
      ))}
      <Contact />
    </main>
  );
}
