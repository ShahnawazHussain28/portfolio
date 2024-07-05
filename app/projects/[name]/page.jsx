"use client";
import LetsWork from "@/app/components/LetsWork";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BsGlobe2 } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
import { AiFillYoutube } from "react-icons/ai";
import { projects } from "@/public/projects";
import Navbar from "@/app/components/Navbar";
// import observer from "@/app/utils/intersectionObserver";
import { useEffect } from "react";

export default function Project() {
  const params = useParams();
  const data = projects[params.name];
  // useEffect(() => {
  //   const observerElements = document.querySelectorAll(
  //     ".translate-up,.fade-on-scroll,.translate-right-cascade",
  //   );
  //   observerElements.forEach((element) => {
  //     observer.observe(element);
  //   });
  // }, []);
  return (
    <div className="w-full">
      <Navbar />
      <div className="flex flex-col items-center w-full">
        <h2 className="mt-20 text-sm font-bold uppercase md:text-base text-sky-500">
          Project Showcase
        </h2>
        <div className="translate-up">
          <h1 className="mt-5 font-serif text-3xl font-bold text-center md:text-6xl text-blue-950">
            {data.title}
          </h1>
          <p className="mx-5 mt-5 max-w-2xl text-sm leading-snug text-center md:text-base text-blue-950">
            {data.description}
          </p>
        </div>
        <div className="grid grid-flow-col gap-2 place-items-center mt-5 sm:gap-5">
          {["url", "github", "youtube"].map(
            (key) =>
              data[key] && (
                <Link
                  key={key}
                  href={data[key]}
                  target="_blank"
                  className="flex gap-2 items-center py-2 px-2 text-sm text-white bg-gradient-to-br to-indigo-600 rounded transition-all sm:px-5 sm:text-base hover:to-indigo-700 from-sky-500 shadow-indigo-500 hover:shadow-[2px_4px_7px_skyblue] hover:from-sky-600"
                >
                  {key === "url" ? (
                    <BsGlobe2 className="text-2xl md:text-3xl" />
                  ) : key === "github" ? (
                    <FaGithub className="text-2xl md:text-3xl" />
                  ) : (
                    <AiFillYoutube className="text-2xl md:text-3xl" />
                  )}
                  <span>
                    {key === "url"
                      ? "Visit Site"
                      : key === "github"
                        ? "Github"
                        : "Youtube"}
                  </span>
                </Link>
              ),
          )}
        </div>
        <div className="flex relative flex-col gap-5 justify-center items-center px-5 mt-20 w-full md:px-10">
          {Array.isArray(data.image)
            ? data.image.map((img, index) => (
                <img
                  src={`/screenshots/${img}`}
                  alt="project"
                  key={index}
                  className="rounded-lg max-w-[90%] sm:max-w-[70%]"
                />
              ))
            : data.image && (
                <Image
                  src={`/screenshots/${data.image}`}
                  width={1000}
                  height={3000}
                  alt="project"
                  className="rounded-lg"
                />
              )}
          <div className="absolute top-40 w-full h-full bg-sky-100 z-[-1]"></div>
        </div>
      </div>
      <div className="z-50">
        <LetsWork />
      </div>
    </div>
  );
}
