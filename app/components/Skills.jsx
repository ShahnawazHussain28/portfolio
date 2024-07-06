"use client";
import Image from "next/image";
import htmlIcon from "@/public/logos/html-icon.svg";
import cssIcon from "@/public/logos/css-icon.svg";
import javascriptIcon from "@/public/logos/javascript-icon.svg";
import reactIcon from "@/public/logos/reactjs-icon.svg";
import nextjsIcon from "@/public/logos/nextjs-icon.svg";
import tailwindIcon from "@/public/logos/tailwind-icon.svg";
import bootstrapIcon from "@/public/logos/bootstrap-icon.svg";
import nodeIcon from "@/public/logos/nodejs-icon.svg";
import expressIcon from "@/public/logos/expressjs-icon.svg";
import gitIcon from "@/public/logos/git-icon.svg";
import githubIcon from "@/public/logos/github-icon.svg";
import pythonIcon from "@/public/logos/python-icon.svg";
import opencvIcon from "@/public/logos/opencv-icon.svg";
import postgresqlIcon from "@/public/logos/postgresql-icon.svg";
import strapiIcon from "@/public/logos/strapi-icon.svg";
import unityIcon from "@/public/logos/unity-icon.svg";
import cIcon from "@/public/logos/c-icon.svg";
import cplusplusIcon from "@/public/logos/cplusplus-icon.svg";
import csharpIcon from "@/public/logos/csharp-icon.svg";
import javaIcon from "@/public/logos/java-icon.svg";
import useEmblaCarousel from "embla-carousel-react";
import AutoPlay from "embla-carousel-autoplay";
import Link from "next/link";
import ScrollAnimation from "react-animate-on-scroll";

const icons = [
  {
    icon: nextjsIcon,
    name: "Next.js",
    link: "https://nextjs.org/",
  },
  {
    icon: reactIcon,
    name: "React.js",
    link: "https://react.dev/",
  },
  {
    icon: tailwindIcon,
    name: "Tailwind",
    link: "https://tailwindcss.com/",
  },
  {
    icon: bootstrapIcon,
    name: "Bootstrap",
    link: "https://getbootstrap.com/",
  },
  {
    icon: nodeIcon,
    name: "Node.js",
    link: "https://nodejs.org/en/",
  },
  {
    icon: expressIcon,
    name: "Express.js",
    link: "https://expressjs.com/",
  },
  {
    icon: gitIcon,
    name: "Git",
    link: "https://git-scm.com/",
  },
  {
    icon: pythonIcon,
    name: "Python",
    link: "https://www.python.org/",
  },
  {
    icon: opencvIcon,
    name: "OpenCV",
    link: "https://opencv.org/",
  },
  {
    icon: postgresqlIcon,
    name: "PostgreSQL",
    link: "https://www.postgresql.org/",
  },
  {
    icon: strapiIcon,
    name: "Strapi",
    link: "https://strapi.io/",
  },
  {
    icon: unityIcon,
    name: "Unity",
    link: "https://unity.com/",
  },
  {
    icon: githubIcon,
    name: "GitHub",
    link: "https://github.com/",
  },
  {
    icon: htmlIcon,
    name: "HTML",
    link: "https://developer.mozilla.org/en-US/docs/Web/HTML",
  },
  {
    icon: cssIcon,
    name: "CSS",
    link: "https://www.w3.org/Style/CSS/",
  },
  {
    icon: javascriptIcon,
    name: "JavaScript",
    link: "https://javascript.info/",
  },
  {
    icon: javaIcon,
    name: "Java",
    link: "https://www.java.com/",
  },
  {
    icon: cIcon,
    name: "C",
    link: "https://en.wikipedia.org/wiki/C_(programming_language)",
  },
  {
    icon: cplusplusIcon,
    name: "C++",
    link: "https://en.wikipedia.org/wiki/C%2B%2B",
  },
  {
    icon: csharpIcon,
    name: "C#",
    link: "https://docs.microsoft.com/en-us/dotnet/csharp/",
  },
];

export default function Skills() {
  const [emblaRef, _emblaApi] = useEmblaCarousel({ loop: true }, [
    AutoPlay({ playOnInit: true, stopOnInteraction: true, delay: 2000 }),
  ]);

  return (
    <div className="px-5 pt-28 w-full md:px-20" id="skills">
      <ScrollAnimation animateIn="fadeInUp" animateOnce>
        <h1 className="mt-5 mb-3 text-4xl font-bold text-center md:text-6xl text-blue-950">
          Skills
        </h1>
        <div className="mx-auto mb-5 bg-gradient-to-r via-indigo-500 from-sky-300 to-sky-300 h-[6px] w-[80px]"></div>
        <p className="text-center">
          Here are some of the technologies I have worked with.
        </p>
      </ScrollAnimation>
      <section className="py-10 mt-12 embla bg-[#eff8ff]">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {icons.map((icon, index) => (
              <Link
                href={icon.link}
                key={index}
                className="w-24 h-24 rounded-xl sm:w-36 sm:h-36 md:w-52 md:h-52 embla__slide group"
              >
                <Image
                  src={icon.icon}
                  alt="html"
                  width={400}
                  height={400}
                  className="mx-auto w-16 h-16 transition sm:w-28 sm:h-28 md:w-40 md:h-40 group-hover:-translate-y-12"
                />
                <p className="-mt-5 text-lg font-bold text-center opacity-0 transition md:text-3xl group-hover:opacity-100">
                  {icon.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* <div className="overflow-x-auto mt-20 space-x-10 w-full whitespace-nowrap"> */}
      {/* </div> */}
    </div>
  );
}
