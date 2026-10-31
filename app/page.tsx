import Hero from "@/components/sections/Hero";
import WorkWith from "@/components/sections/WorkWith";
import DigitalPartner from "@/components/sections/DigitalPartner";
import Services from "@/components/sections/Services";
import VideoStats from "@/components/sections/VideoStats";
import LatestWork from "@/components/sections/LatestWork";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <WorkWith />
      <DigitalPartner />
      <Services />
      <VideoStats />
      <LatestWork />
      <Testimonials />
      <Contact />
    </main>
  );
}
