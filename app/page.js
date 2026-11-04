import Hero from "./components/site/Hero";
import Work from "./components/site/Work";
import Experience from "./components/site/Experience";
import About from "./components/site/About";
import Contact from "./components/site/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Work />
      <Experience />
      <About />
      <Contact />
    </main>
  );
}
