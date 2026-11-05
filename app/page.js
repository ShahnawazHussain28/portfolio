import Hero from "./components/site/Hero";
import IncognitionStory from "./components/site/IncognitionStory";
import DastaanStory from "./components/site/DastaanStory";
import Gallery from "./components/site/Gallery";
import Experience from "./components/site/Experience";
import About from "./components/site/About";
import Contact from "./components/site/Contact";
import { projects } from "./data/projects";

export default function Home() {
  const featured = projects.filter((p) => p.featured && !["dastaan", "incognition"].includes(p.slug) && p.image);

  return (
    <main>
      <Hero />
      <IncognitionStory />
      <DastaanStory />
      <Gallery projects={featured} total={projects.length} />
      <Experience />
      <About />
      <Contact />
    </main>
  );
}
