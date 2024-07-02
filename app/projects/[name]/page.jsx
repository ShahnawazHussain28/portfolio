"use client";
import LetsWork from "@/app/components/LetsWork";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const projects = {
  "gauge-website": {
    title: "Gauge Ecommerce Website",
    description:
      "I've developed a fully functional eCommerce website with a user-friendly landing page highlighting product features and offers. It includes a blog section with content suggestion. The About Us page shares the brand's story. The contact page provides an inquiry form and company contacts. The site ensures a seamless purchase experience for Gauge RO products with detailed descriptions, high-quality images and customer reviews",
    url: "https://gauge.komsup.com",
    image: "/screenshots/ecommerce-long.png",
  },
  "consumer-app": {
    title: "Consumer App",
    description:
      "Developed a PWA for customers of the Smart Water Purifier, enabling them to view purifier data, operate the RO remotely, and perform complex troubleshooting steps. It includes an FAQ, user guide, tutorials, and a profile page. Additionally, there's an issues section where users can view and address problems related to their purifier.",
    url: "https://pwa2.komsup.com/",
    image: [
      "/screenshots/consumerapp-1.png",
      "/screenshots/consumerapp-2.png",
      "/screenshots/consumerapp-3.png",
      "/screenshots/consumerapp-4.png",
      "/screenshots/consumerapp-5.png",
      "/screenshots/consumerapp-6.png",
      "/screenshots/consumerapp-7.png",
    ],
  },
  "technician-app": {
    title: "Technician App",
    description:
      "Developed a PWA for technicians and team members to view and manage their teams and assigned tasks. It includes functionality to assign tasks, track and update ticket statuses, and features for revisiting and rescheduling.",
    url: "https://pegpwa.komsup.com/",
    image: [
      "/screenshots/pegapp-1.png",
      "/screenshots/pegapp-short.png",
      "/screenshots/pegapp-2.png",
      "/screenshots/pegapp-3.png",
    ],
  },
  "automated-testing": {
    title: "Automated Integration Testing",
    description:
      "A complete testing environment for the Smart RO. It contains the flow of every possible failure. It saved us 5 hours of manual testing per day.",
    image: "/screenshots/testing-short.jpg",
  },
};

export default function Project() {
  const params = useParams();
  const data = projects[params.name];
  return (
    <div className="w-full">
      <div className="flex flex-col items-center w-full">
        <h2 className="mt-20 font-bold uppercase text-sky-500">
          Project Showcase
        </h2>
        <h1 className="mt-5 font-serif text-6xl font-bold text-blue-950">
          {data.title}
        </h1>
        <p className="mt-5 max-w-2xl leading-snug text-center text-blue-950">
          {data.description}
        </p>
        <div className="flex gap-2 items-center mt-5">
          {["url", "github", "youtube"].map(
            (key) =>
              data[key] && (
                <Link key={key} href={data[key]} target="_blank">
                  <button className="py-2 px-8 text-white bg-gradient-to-br to-indigo-600 rounded transition-all hover:to-indigo-700 from-sky-500 shadow-indigo-500 hover:shadow-[2px_4px_7px_skyblue] hover:from-sky-600">
                    {key === "url"
                      ? "Visit Site"
                      : key === "github"
                        ? "Github"
                        : "Youtube"}
                  </button>
                </Link>
              ),
          )}
        </div>
        <div className="flex relative flex-col gap-5 justify-center items-center px-5 mt-20 w-full md:px-10">
          {Array.isArray(data.image) ? (
            data.image.map((img, index) => (
              <img src={img} alt="project" key={index} className="rounded-lg" />
            ))
          ) : (
            <Image
              src={data.image}
              width={1000}
              height={3000}
              alt="project"
              className="rounded-lg"
            />
          )}
          <div className="absolute top-40 w-full h-full bg-sky-100 z-[-1]"></div>
        </div>
      </div>
      <div className="z-50">
        <LetsWork />
      </div>
    </div>
  );
}
