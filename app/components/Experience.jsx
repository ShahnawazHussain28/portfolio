"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import ecommerce from "@/public/screenshots/ecommerce-short.png";
import consumerapp from "@/public/screenshots/consumerapp-short.png";
import technicianapp from "@/public/screenshots/pegapp-short.png";
import testingapp from "@/public/screenshots/testing-short.jpg";
import Link from "next/link";
import observer from "../utils/intersectionObserver";

const experienceData = [
  {
    image: ecommerce,
    title: "Ecommerce Website",
    role: "Full Stack",
    desc: "Building a fully functional Ecommerce website containing landing page, blogs, about, contact and purchase functionality of Gauge RO.",
    tech: ["NextJS", "TailwindCSS", "NodeJS", "Strapi"],
    to: "/projects/gauge-website",
  },
  {
    image: consumerapp,
    title: "Consumer App (PWA)",
    role: "Frontend",
    desc: "Developed a PWA for customers where they can view the purifier's data, operate the RO remotely and perform complex troubleshooting steps.",
    tech: ["NextJS", "ReactJS", "TailwindCSS"],
    to: "/projects/consumer-app",
  },
  {
    image: technicianapp,
    title: "Technician App (PWA)",
    role: "Frontend",
    desc: "Developed a PWA for the technicians and team members where they can view and manage their team members and their assigned tasks",
    tech: ["NextJS", "ReactJS", "TailwindCSS"],
    to: "/projects/technician-app",
  },
  {
    image: testingapp,
    title: "Automated Integration Testing",
    role: "Full Stack",
    desc: "A complete testing environment for the Smart RO. It contains the flow of every possible failure. It saved us 5 hours of manual testing per day.",
    tech: ["NextJS", "Tailwind", "NodeJS", "Express", "RestAPI", "PostgreSQL"],
    to: "/projects/automated-testing",
  },
];

export default function Experience() {
  useEffect(() => {
    const observerElements = document.querySelectorAll(
      ".translate-up,.fade-on-scroll,.translate-right-cascade",
    );
    observerElements.forEach((element) => {
      observer.observe(element);
    });
  }, []);
  return (
    <div className="px-10 w-full min-h-screen xl:px-20" id="experience">
      <h1 className="mt-16 mb-3 text-4xl font-bold text-center md:text-6xl text-blue-950 translate-up">
        Experience
      </h1>
      <div className="mx-auto mb-16 bg-gradient-to-r via-indigo-500 from-sky-300 to-sky-300 h-[6px] w-[80px] translate-up"></div>
      <div className="w-full">
        <h3 className="text-xl font-bold text-left md:text-3xl">
          Intern at Gauge RO - India&apos;s smartest water purifier
        </h3>
        <div className="grid grid-cols-1 gap-5 my-8 w-full md:grid-cols-2 md:px-20 lg:grid-cols-4 lg:px-0">
          {experienceData.map((data, index) => (
            <Link
              href={data.to ?? "/"}
              key={index}
              className="overflow-hidden rounded-lg shadow-lg transition cursor-pointer hover:shadow-2xl bg-[#eff8ff] translate-right-cascade"
            >
              <Image
                src={data.image}
                height={200}
                width={300}
                alt="project"
                className="object-cover w-full aspect-video"
              />
              <div className="px-5 pt-3 pb-5 w-fit">
                <p className="mb-3 text-lg font-semibold text-gray-800 sm:text-xl">
                  {data.title}
                </p>
                <div className="px-2 text-sm font-semibold text-gray-200 bg-gray-800 rounded sm:text-base w-fit">
                  {data.role}
                </div>
                <p className="mt-2 text-sm text-gray-800 sm:text-base w-fit">
                  {data.desc}
                </p>
                {data.tech.map((tech, index) => (
                  <div
                    key={index}
                    className="inline-block px-1 m-1 mt-2 text-sm font-semibold text-gray-800 bg-gray-200 rounded"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
