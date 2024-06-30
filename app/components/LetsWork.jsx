import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

export default function LetsWork() {
  return (
    <div className="flex flex-col items-center pb-60 mt-40 w-full" id="contact">
      <h1 className="mt-5 mb-3 text-6xl font-bold text-center text-blue-950">
        Let&apos;s Work Together
      </h1>
      <div className="mx-auto mb-5 bg-gradient-to-r via-indigo-500 from-sky-300 to-sky-300 h-[6px] w-[80px]"></div>
      <p className="text-center">I am always looking for new projects.</p>

      <button className="py-2 mt-10 px-8 rounded-full text-2xl font-semibold border-4 border-indigo-500 bg-[#eff8ff] hover:bg-indigo-500 hover:text-white transition">
        Email me
      </button>
      <div className="flex gap-16 my-10">
        <Link href="https://www.linkedin.com/in/shahnawaz/">
          <FaLinkedin className="text-8xl text-[#0077B5] hover:scale-105 transition" />
        </Link>
        <Link href="https://github.com/shahnawaz">
          <FaGithub className="text-8xl text-[#333] hover:scale-105 transition" />
        </Link>
      </div>
    </div>
  );
}
