"use client";
import Image from "next/image";
import profileImage from "@/public/profilepic.jpg";
import { SiNextdotjs } from "react-icons/si";
import { FaReact } from "react-icons/fa6";
import ScrollAnimation from "react-animate-on-scroll";

export default function Hello() {
  return (
    <div
      className="grid auto-rows-[minmax(100px,auto)] gap-10 w-full min-h-screen md:grid-cols-2"
      id="hello"
    >
      <div className="flex justify-center items-center pt-24 md:justify-end md:pt-0">
        <ScrollAnimation
          animateOnce
          animateIn="fadeInUp"
          className="px-10 w-full sm:px-20 md:px-0 md:w-min"
        >
          <h1 className="text-4xl font-bold lg:text-6xl xl:text-7xl">Hello,</h1>
          <h2 className="text-4xl font-bold lg:text-6xl xl:text-7xl">
            <span className="mr-5">I&apos;m</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Shahnawaz
            </span>
          </h2>
          <p className="text-lg font-semibold text-gray-700 whitespace-nowrap md:text-xl lg:text-3xl">
            Full Stack Web Developer
          </p>
          <p className="mt-5 text-sm text-gray-600 sm:text-base">
            I develop frontend as well as backend systems using latest and
            trending tech-stacks for business solutions. I also have keen
            interest in making production level video games. I am a BTech 4th
            Year student and I am very passionate to develop and love to learn
            new technologies. We can work together and build something great.
          </p>
        </ScrollAnimation>
      </div>
      <div className="flex justify-center items-center">
        <ScrollAnimation
          animateOnce
          animateIn="fadeInRight"
          className="relative m-10"
        >
          <SiNextdotjs className="absolute top-0 left-0 text-6xl md:text-8xl animate-dangle" />
          <FaReact className="absolute right-0 bottom-1/2 text-6xl md:text-9xl animate-[spin_20s_linear_infinite]" />
          <Image
            src={profileImage}
            alt="profile"
            width={400}
            height={400}
            className="z-50 rounded-3xl w-[90%] h-[90%] max-w-[400px]"
            style={{ boxShadow: "20px -20px 0px 0px rgba(200,200,255,0.8)" }}
          />
        </ScrollAnimation>
      </div>
    </div>
  );
}
