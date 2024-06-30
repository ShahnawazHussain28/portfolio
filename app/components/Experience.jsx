import Image from "next/image";
import React from "react";

const experienceData = [
  {
    image: "https://placehold.co/600x400/png",
    title: "Ecommerce Website",
    role: "Full Stack",
    desc: "Building a fully functional Ecommerce website containing landing page, blogs, about, contact and purchase functionality of Gauge RO.",
    tech: ["NextJS", "TailwindCSS", "NodeJS", "Strapi"],
  },
  {
    image: "https://placehold.co/600x400/png",
    title: "Consumer App (PWA)",
    role: "Frontend",
    desc: "Developed a PWA for customers where they can view the purifier's data, operate the RO remotely and perform complex troubleshooting steps.",
    tech: ["NextJS", "ReactJS", "TailwindCSS"],
  },
  {
    image: "https://placehold.co/600x400/png",
    title: "Technician App (PWA)",
    role: "Frontend",
    desc: "Developed a PWA for the technicians and team members where they can view and manage their team members and their assigned tasks",
    tech: ["NextJS", "ReactJS", "TailwindCSS"],
  },
  {
    image: "https://placehold.co/600x400/png",
    title: "Automated Integration Testing",
    role: "Full Stack",
    desc: "A complete testing environment for the Smart RO. It contains the flow of every possible failure. It saved us 5 hours of manual testing per day.",
    tech: ["NextJS", "Tailwind", "NodeJS", "Express", "RestAPI", "PostgreSQL"],
  },
];

export default function Experience() {
  return (
    <div className="px-20 w-full min-h-screen" id="experience">
      <h1 className="mt-16 mb-3 text-6xl font-bold text-center text-blue-950">
        Experience
      </h1>
      <div className="mx-auto mb-16 bg-gradient-to-r via-indigo-500 from-sky-300 to-sky-300 h-[6px] w-[80px]"></div>
      <div className="w-full">
        <h3 className="text-3xl font-bold text-left">
          Intern at Gauge RO - India&apos;s smartest water purifier
        </h3>
        <div className="grid grid-cols-4 gap-5 my-8 w-full">
          {experienceData.map((data, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg shadow-lg transition cursor-pointer hover:shadow-2xl bg-[#eff8ff]"
            >
              <Image
                src={data.image}
                height={200}
                width={300}
                alt="project"
                className="w-full"
              />
              <div className="px-5 pt-3 pb-5 w-fit">
                <p className="mb-3 text-xl font-semibold text-gray-800">
                  {data.title}
                </p>
                <div className="px-2 font-semibold text-gray-200 bg-gray-800 rounded w-fit">
                  {data.role}
                </div>
                <p className="mt-2 text-gray-800 w-fit">{data.desc}</p>
                {data.tech.map((tech, index) => (
                  <div
                    key={index}
                    className="inline-block px-1 m-1 mt-2 text-sm font-semibold text-gray-800 bg-gray-200 rounded"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
