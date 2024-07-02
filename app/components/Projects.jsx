"use client";
import Image from "next/image";
import React from "react";
import circuitsim from "@/public/screenshots/circuitsim-short.png";
import unfairchat from "@/public/screenshots/unfairchat-short.png";
import squidgame from "@/public/screenshots/squidgame-short.png";
import Link from "next/link";

const projectImages = [
  {
    image: circuitsim,
    title: "Digital Circuit Simulator",
    desc: "A digital circuit simulator with a real-time simulation of the circuit. It allows users to design and simulate their own circuits. You can make your own computer from scratch",
    to: "/projects/circuitsim",
  },
  {
    image: unfairchat,
    title: "Unfair Chat",
    desc: "Chat with friends & see their online status, but with a twist! Unfair Chat lets you peek at who they're talking to (and maybe what they're typing ). Just for laughs!",
    to: "/projects/unfairchat",
  },
  {
    image: squidgame,
    title: "The Squid Game",
    desc: "A game made with Unity. It is created after the famous Squid Game web series. It's a 3D survival game where you are the Player456 and have to survive those 4 games to be the winner",
    to: "/projects/squidgame",
  },
  {
    image: "https://placehold.co/300x500/0000ff/white/png",
    title: "Smart WhatsApp Bot",
    desc: "Meet your all-in-one WhatsApp sidekick! This AI bot answers questions, finds images, translates languages, discovers music, and solves math problems using Google and DuckDuckGo.",
    to: "/projects/whatsappbot",
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
            <div className="px-10 w-4/5 bg-[#eff8ff]">
              <h3 className="text-3xl font-bold">{data.title}</h3>
              <p className="">{data.desc}</p>
            </div>
            <Link
              href={data.to}
              className="py-1 px-5 mt-2 mr-10 rounded-full border-4 border-indigo-500 bg-[#eff8ff] hover:bg-indigo-500 hover:text-white transition"
            >
              View Project
            </Link>
          </div>
          <Image
            src={data.image}
            alt="project"
            height={500}
            width={300}
            className="object-cover rounded-lg border-indigo-500 translate-x-10 cursor-pointer w-[300] h-[500] scroll-fade aspect-[9_/_16] shadow-[0_0_10px_3px_gray]"
            style={{ backgroundPosition: "right", backgroundSize: "cover" }}
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
