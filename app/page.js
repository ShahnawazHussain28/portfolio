import Image from "next/image";
import Hello from "./components/Hello";
import Experience from "./components/Experience";
import Projects from "./components/Projects";

export default function Home() {
  return (
    <div className="bg-sky-100/50">
      <div
        className="flex fixed justify-center items-center w-screen h-screen text-5xl font-extrabold text-white xs:text-[4rem] z-[-50] sm:text-[6rem] md:text-[7rem] lg:text-[10rem] xl:text-[12rem]"
        style={{ textShadow: "0 0px 1px #55f" }}
      >
        SHAHNAWAZ
      </div>
      <Hello />
      <Experience />
      <Projects />
    </div>
  );
}
