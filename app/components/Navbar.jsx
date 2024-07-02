import Link from "next/link";
import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 py-3 px-8 w-screen bg-[#eff8ff] border-b border-gray-400 flex justify-evenly z-[500]">
      <button className="py-1 px-5 text-white bg-indigo-500 hover:bg-[#eff8ff] rounded-full hover:outline hover:text-black outline-indigo-500 transition-all">
        Email me
      </button>
      <div className="flex gap-4 items-center font-bold">
        <Link href="#hello">Hello</Link>
        <Link href="#experience">Experience</Link>
        <Link href="#projects">Projects</Link>
        <Link href="#skills">Skills</Link>
        <Link href="#contact">Contact</Link>
      </div>

      <div className="flex gap-4 items-center font-bold">
        <Link href="https://www.linkedin.com/in/shahnawaz/">
          <FaLinkedin className="text-3xl text-[#0077B5] hover:scale-105 transition" />
        </Link>
        <Link href="https://github.com/shahnawaz">
          <FaGithub className="text-3xl text-[#333] hover:scale-105 transition" />
        </Link>
      </div>
    </div>
  );
}
