"use client";

import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import Image from "next/image";
import React from "react";

const projectImages = [
  {
    image: "https://placehold.co/300x500/0000ff/white/png",
    title: "Ecommerce Website",
    desc: "Building a fully functional Ecommerce website containing landing page, blogs, about, contact and purchase functionality of Gauge RO.",
  },
  {
    image: "https://placehold.co/300x500/0000ff/white/png",
    title: "Consumer App (PWA)",
    desc: "Developed a PWA for customers where they can view the purifier's data, operate the RO remotely and perform complex troubleshooting steps.",
  },
  {
    image: "https://placehold.co/300x500/0000ff/white/png",
    title: "Technician App (PWA)",
    desc: "Developed a PWA for the technicians and team members where they can view and manage their team members and their assigned tasks",
  },
  {
    image: "https://placehold.co/300x500/0000ff/white/png",
    title: "Automated Integration Testing",
    desc: "A complete testing environment for the Smart RO. It contains the flow of every possible failure. It saved us 5 hours of manual testing per day.",
  },
];

export default function Projects() {
  return (
    <div className="relative w-full" id="projects">
      <h1 className="mt-5 mb-3 text-6xl font-bold text-center text-blue-950">
        Personal Projects
      </h1>
      <div className="mx-auto mb-5 bg-gradient-to-r via-indigo-500 from-sky-300 to-sky-300 h-[6px] w-[80px]"></div>
      <p className="text-center">Check out the projects that I have done.</p>
      <div
        className="absolute left-1/2 mt-6 h-[95%] -translate-x-1/2 w-[4px] z-50"
        style={{
          backgroundImage:
            "linear-gradient(180deg, transparent 0%, #364385 10%, #364385 90%, transparent 100%)",
        }}
      ></div>
      {projectImages.map((data, index) => (
        <div
          key={index}
          className="grid relative grid-cols-2 my-10 w-full h-max"
        >
          <div className="flex relative flex-col justify-center items-end text-right scroll-fade">
            <div className="px-10 w-3/5 bg-[#eff8ff]">
              <h3 className="text-3xl font-bold">{data.title}</h3>
              <p className="">{data.desc}</p>
            </div>
            <button className="py-1 px-5 mt-2 mr-10 rounded-full border-4 border-indigo-500 bg-[#eff8ff] hover:bg-indigo-500 hover:text-white transition">
              View Project
            </button>
          </div>
          <Image
            src={data.image}
            alt="project"
            height={500}
            width={300}
            className="w-auto h-auto rounded-lg translate-x-10 cursor-pointer scroll-fade"
          />
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-black rounded-full -translate-x-1/2 shadow-[0_0_0_3px_white] z-[55]"></div>
        </div>
      ))}
      <button className="py-2 text-lg px-5 mr-10 rounded-full border-4 border-indigo-500 bg-[#eff8ff] hover:bg-indigo-500 hover:text-white transition absolute left-1/2 -translate-x-1/2">
        View Other Projects
      </button>
    </div>
  );
}
