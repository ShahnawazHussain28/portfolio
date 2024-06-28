import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Shahnawaz Hussain - Stunning web developer",
  description:
    "A portfolio of Shahnawaz Hussain, an experienced, passionate and creative web developer.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
