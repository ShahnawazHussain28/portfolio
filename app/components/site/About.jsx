"use client";
import ToolBox from "./ToolBox";
import AboutTiles from "./AboutTiles";
import Recognition from "./Recognition";
import { stack } from "@/app/data/profile";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative">
      <div className="mx-auto max-w-page px-5 py-24 md:px-8 md:pb-36 md:pt-20">
        <h2
          id="about-title"
          className="t-display"
        >
          About
        </h2>

        <AboutTiles />

        <Recognition />

        <div className="mt-24">
          <h3 className="t-title">What I build with</h3>
          <p className="mt-2 text-graphite">
            <span className="[@media(hover:none)]:hidden">Grab a block and throw it.</span>
            <span className="hidden [@media(hover:none)]:inline">Tap a block to flick it.</span>
          </p>
          <div className="mt-8">
            <ToolBox stack={stack} />
          </div>
        </div>
      </div>
    </section>
  );
}
