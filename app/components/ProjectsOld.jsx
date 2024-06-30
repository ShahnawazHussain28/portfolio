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
    <>
      <Parallax pages={projectImages.length * 0.9}>
        <h1 className="my-5 text-6xl font-bold text-center text-blue-950">
          Personal Projects
        </h1>
        <p className="text-center">Check out the projects that I have done.</p>
        <div
          className="absolute left-1/2 -translate-x-1/2 mt-16 w-[4px] h-[90%]"
          style={{
            backgroundImage:
              "linear-gradient(180deg, transparent 0%, #364385 10%, #364385 90%, transparent 100%)",
          }}
        ></div>
        {projectImages.map((data, index) => (
          <ParallaxLayer
            key={index}
            speed={1}
            factor={0.6}
            sticky={{ start: index * 0.8 - 0.1, end: index * 0.8 + 0.3 }}
            className="flex items-center"
          >
            <div className="flex relative flex-col justify-center items-end w-1/2 text-right scroll-fade">
              <div className="px-10 w-3/5">
                <h3 className="text-3xl font-bold">{data.title}</h3>
                <p className="">{data.desc}</p>
              </div>
              <button className="py-1 px-5 mt-2 mr-10 rounded-full border-4 border-indigo-500 bg-[#eff8ff] hover:bg-indigo-500">
                View Project
              </button>
            </div>
            <div className="w-4 h-4 bg-black rounded-full -translate-x-1/2 shadow-[0_0_0_3px_white]"></div>
          </ParallaxLayer>
        ))}
        {projectImages.map((data, index) => (
          <ParallaxLayer key={index} offset={index * 0.8 + 0.3} factor={0.6}>
            <Image
              src={data.image}
              alt="project"
              height={500}
              width={300}
              className="absolute left-1/2 w-auto h-full rounded-lg translate-x-10 cursor-pointer"
            />
          </ParallaxLayer>
        ))}
      </Parallax>
    </>
  );
}
