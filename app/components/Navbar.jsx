"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { AiFillYoutube } from "react-icons/ai";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <div
      className={`fixed top-0 left-0 py-3 md:px-8 px-4 w-screen bg-[#eff8ff] border-b border-gray-400 flex justify-between z-[500] ${pathname === "/" ? "sm:justify-evenly" : ""}`}
    >
      <Link
        href={"mailto:shahnawazhussain2802@gmail.com"}
        className="py-1 px-5 text-white bg-indigo-500 hover:bg-[#eff8ff] rounded-full hover:outline hover:text-black outline-indigo-500 transition-all"
      >
        Email me
      </Link>
      <div
        className={`hidden gap-4 items-center font-bold ${pathname == "/" ? "sm:flex" : ""}`}
      >
        <Link href="#hello">Hello</Link>
        <Link href="#experience">Experience</Link>
        <Link href="#projects">Projects</Link>
        <Link href="#skills">Skills</Link>
        <Link href="#contact">Contact</Link>
      </div>

      <div className="flex gap-2 items-center font-bold md:gap-4">
        <Link
          target="_blank"
          href="https://www.linkedin.com/in/shahnawaz-hussain-110919227/"
        >
          <FaLinkedin className="text-3xl text-[#0077B5]" />
        </Link>
        <Link target="_blank" href="https://github.com/ShahnawazHussain28/">
          <FaGithub className="text-3xl text-[#333]" />
        </Link>
        <Link target="_blank" href="https://www.youtube.com/@codeuniverse9015">
          <AiFillYoutube className="text-3xl text-[#FF0000]" />
        </Link>
      </div>
    </div>
  );
}
