import Image from "next/image";
import React from "react";
import profileImage from "@/public/profilepic.png";
import { SiNextdotjs } from "react-icons/si";
import { FaReact } from "react-icons/fa6";

export default function Hello() {
  return (
    <div className="grid grid-cols-2 w-full min-h-screen">
      <div className="flex justify-end items-center">
        <div className="w-min">
          <h1 className="text-7xl font-bold">Hello,</h1>
          <h2 className="text-7xl font-bold">
            <span className="mr-5">I'm</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Shahnawaz
            </span>
          </h2>
          <p className="text-3xl font-semibold text-gray-700">
            Full Stack Web Developer
          </p>
          <p className="mt-5 text-gray-600">
            I develop frontend as well as backend systems using latest and
            trending tech-stacks for business solutions. I also have keen
            interest in making production level video games. I am a BTech 4th
            Year student and I am very passionate to develop and love to learn
            new technologies. We can work together and build something great.
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="relative">
          <SiNextdotjs className="absolute top-0 left-0 text-8xl animate-dangle" />
          <FaReact className="absolute right-0 bottom-1/2 text-9xl animate-[spin_20s_linear_infinite]" />
          <Image src={profileImage} alt="profile" width={400} height={400} />
        </div>
      </div>
    </div>
  );
}
