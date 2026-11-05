import { Bricolage_Grotesque, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import Nav from "./components/site/Nav";
import CommandPalette from "./components/site/CommandPalette";
import Footer from "./components/site/Footer";
import SmoothScroll from "./components/site/motion/SmoothScroll";
import Intro from "./components/site/motion/Intro";
import Cursor from "./components/site/motion/Cursor";
import DotField from "./components/site/motion/DotField";
import PageTransition from "./components/site/motion/PageTransition";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-display",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata = {
  title: "Shahnawaz Hussain, software engineer",
  description:
    "Shahnawaz Hussain is a full-stack and AI engineer. He leads engineering on Incognition, a platform that teaches machine learning from zero, and builds health apps with on-device AI at Bharathaap Technologies (IIT Hyderabad).",
};

// Runs before first paint so the page never flashes the wrong theme.
// A saved choice wins; otherwise the theme follows the visitor's local time.
const themeScript = `(function(){try{var s=localStorage.getItem('theme');var h=new Date().getHours();var t=s||(h>=7&&h<19?'light':'dark');var d=document.documentElement;d.dataset.theme=t;d.dataset.themeSource=s?'manual':'auto';if(sessionStorage.getItem('intro')==='seen')d.dataset.intro='seen';}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Intro />
        <DotField />
        <Nav />
        <div id="main" className="relative z-10">
          {children}
        </div>
        <Footer />
        <CommandPalette />
        <PageTransition />
        <Cursor />
        <SmoothScroll />
      </body>
    </html>
  );
}
