import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/ui/SmoothScroll";
import ScrollProgress from "@/components/ui/ScrollProgress";
import MagneticButtons from "@/components/ui/MagneticButtons";
import Loader from "@/components/ui/Loader";
import "./globals.css";
import { RESPECT_REDUCED_MOTION } from "@/lib/motion";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const description =
  "Helping businesses thrive in the digital age through intelligent IT services, compelling media content, and high-impact marketing solutions.";

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL to the production domain so OG image URLs resolve.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Alpha Eye Technologies | Web, Branding & Digital Marketing",
    template: "%s | Alpha Eye Technologies",
  },
  description,
  applicationName: "Alpha Eye",
  icons: {
    icon: "/logo/logo.svg",
  },
  openGraph: {
    type: "website",
    siteName: "Alpha Eye Technologies",
    title: "Alpha Eye Technologies",
    description,
    images: [{ url: "/images/hero/character.png", width: 2716, height: 2600, alt: "Alpha Eye" }],
  },
  twitter: { card: "summary_large_image", title: "Alpha Eye Technologies", description },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${RESPECT_REDUCED_MOTION ? "respect-motion" : ""}`}
    >
      <body className="bg-starfield min-h-screen font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <noscript>
          <style>{"#site-loader{display:none}"}</style>
        </noscript>
        <Loader />
        <SmoothScroll />
        <ScrollProgress />
        <MagneticButtons />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
