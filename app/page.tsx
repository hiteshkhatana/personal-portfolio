import AskResume from "@/components/AskResume";
import Capabilities from "@/components/Capabilities";
import CommandPalette from "@/components/CommandPalette";
import Contact from "@/components/Contact";
import Cursor from "@/components/Cursor";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Projects from "@/components/Projects";
import ScrollProgress from "@/components/ScrollProgress";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <>
      <Loader />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Capabilities />
        <Projects />
        <Experience />
        <Skills />
        <AskResume />
        <Contact />
      </main>
      <CommandPalette />
      <Cursor />
    </>
  );
}
