import Image from "next/image";
import Hello from "./components/Hello";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import LetsWork from "./components/LetsWork";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div>
      <Hello />
      <Experience />
      <Projects />
      <Skills />
      <LetsWork />
      <Navbar />
    </div>
  );
}
