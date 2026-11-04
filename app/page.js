import Hero from "./components/site/Hero";
import DastaanStory from "./components/site/DastaanStory";
import Gallery from "./components/site/Gallery";
import Experience from "./components/site/Experience";
import About from "./components/site/About";
import Contact from "./components/site/Contact";
import { projects } from "./data/projects";

export default function Home() {
  const featured = projects.filter((p) => p.featured && p.slug !== "dastaan" && p.image);

  return (
    <main>
      <Hero />
      <DastaanStory />
      <Gallery projects={featured} total={projects.length} />
      <Experience />
      <About />
      <Contact />
    </main>
  );
}
