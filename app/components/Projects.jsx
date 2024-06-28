import Image from "next/image";
import React from "react";

export default function Projects() {
  return (
    <div className="py-1 w-full min-h-screen">
      <h1 className="my-5 text-6xl font-bold text-center text-blue-950">
        Personal Projects
      </h1>
      <p className="text-center">Check out the projects that I have done.</p>
      <div className="relative mt-20 w-full">
        <div className="inline-block w-1/2"></div>
        <div className="inline-block absolute w-1 h-full bg-blue-400"></div>
        <div className="inline-block p-20 space-y-12 w-1/2">
          <Image
            src={"https://placehold.co/300x500/png"}
            alt="project"
            height={500}
            width={300}
            className="rounded-lg"
          />
          <Image
            src={"https://placehold.co/300x500/png"}
            alt="project"
            height={500}
            width={300}
            className="rounded-lg"
          />
          <Image
            src={"https://placehold.co/300x500/png"}
            alt="project"
            height={500}
            width={300}
            className="rounded-lg"
          />
          <Image
            src={"https://placehold.co/300x500/png"}
            alt="project"
            height={500}
            width={300}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
