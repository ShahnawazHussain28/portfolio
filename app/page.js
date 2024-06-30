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
      <div
        className="flex fixed justify-center items-center w-screen h-screen text-5xl font-extrabold text-[#eff8ff] bg-sky-100/50 xs:text-[4rem] z-[-50] sm:text-[6rem] md:text-[7rem] lg:text-[10rem] xl:text-[12rem]"
        style={{ textShadow: "0 0px 1px #55f" }}
      >
        SHAHNAWAZ
      </div>
      <Hello />
      <Experience />
      <Projects />
      <Skills />
      <LetsWork />
      <Navbar />
    </div>
  );
}
