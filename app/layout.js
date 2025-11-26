import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "./components/providers/SmoothScrollProvider";
import Navbar from "./components/Navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Shahnawaz Hussain - Full Stack Developer",
  description:
    "Portfolio of Shahnawaz Hussain, a passionate full-stack web developer creating stunning, modern web experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <SmoothScrollProvider>
          <Navbar />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
