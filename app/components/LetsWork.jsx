"use client";
import Link from "next/link";
import { useEffect } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
// import observer from "../utils/intersectionObserver";

export default function LetsWork() {
  // useEffect(() => {
  //   const observerElements = document.querySelectorAll(
  //     ".translate-up,.fade-on-scroll,.translate-right-cascade",
  //   );
  //   observerElements.forEach((element) => {
  //     observer.observe(element);
  //   });
  // }, []);
  return (
    <div className="flex flex-col items-center pb-60 mt-40 w-full" id="contact">
      <div className="translate-up">
        <h1 className="mt-5 mb-3 text-4xl font-bold text-center md:text-6xl text-blue-950">
          Let&apos;s Work Together
        </h1>
        <div className="mx-auto mb-5 bg-gradient-to-r via-indigo-500 from-sky-300 to-sky-300 h-[6px] w-[80px]"></div>
        <p className="text-center">I am always looking for new projects.</p>
      </div>
      <Link
        href={"mailto:shahnawazhussain2802@gmail.com"}
        className="py-2 mt-10 px-5 sm:px-8 rounded-full text-lg md:text-2xl font-semibold border-4 border-indigo-500 bg-[#eff8ff] hover:bg-indigo-500 hover:text-white transition"
      >
        Email me
      </Link>
      <div className="flex gap-10 my-10 md:gap-16">
        <Link
          target="_blank"
          href="https://www.linkedin.com/in/shahnawaz-hussain-110919227/"
        >
          <FaLinkedin className="text-6xl md:text-8xl text-[#0077B5] hover:scale-105 transition" />
        </Link>
        <Link target="_blank" href="https://github.com/ShahnawazHussain28/">
          <FaGithub className="text-6xl md:text-8xl text-[#333] hover:scale-105 transition" />
        </Link>
      </div>
      <p className="mt-5 text-sm text-gray-500 md:text-base">
        shahnawazhussain2802@gmail.com
      </p>
    </div>
  );
}
