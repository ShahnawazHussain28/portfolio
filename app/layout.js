import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Shahnawaz Hussain - Stunning web developer",
  description:
    "A portfolio of Shahnawaz Hussain, an experienced, passionate and creative web developer.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div
          className="flex fixed justify-center items-center w-screen h-screen text-5xl font-extrabold text-[#eff8ff] bg-sky-100/50 xs:text-[4rem] z-[-50] sm:text-[6rem] md:text-[7rem] lg:text-[10rem] xl:text-[12rem]"
          style={{ textShadow: "0 0px 1px #55f" }}
        >
          SHAHNAWAZ
        </div>
        {children}
      </body>
    </html>
  );
}
