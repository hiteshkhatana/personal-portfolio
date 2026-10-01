import type { Metadata, Viewport } from "next";
import "@fontsource-variable/unbounded";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/400-italic.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { profile } from "@/data/profile";

const description =
  "Hitesh Khatana is a full-stack engineer in New Delhi who ships LLM-powered products: React and Next.js frontends, Python and Node.js backends, RAG systems with citations, and real-time pipelines at 25k events per second.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: { default: "Hitesh Khatana, full-stack engineer (LLM and RAG)", template: "%s | Hitesh Khatana" },
  description,
  keywords: ["Hitesh Khatana", "full-stack engineer", "GenAI engineer", "RAG", "LLM integration", "Next.js", "React", "FastAPI", "Node.js", "New Delhi"],
  authors: [{ name: profile.name, url: profile.site }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: profile.site,
    title: "Hitesh Khatana, full-stack engineer (LLM and RAG)",
    description,
    siteName: "Hitesh Khatana",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: "Hitesh Khatana", description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F3EEE4",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: profile.site,
  email: `mailto:${profile.email}`,
  jobTitle: "Full-Stack Engineer",
  address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressCountry: "IN" },
  sameAs: [profile.github, profile.linkedin],
  knowsAbout: ["Retrieval-augmented generation", "LLM systems", "Full-stack development", "Real-time event processing"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <noscript>
          <style>{`.reveal,.pl{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a href="#about" className="skip">Skip to content</a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
