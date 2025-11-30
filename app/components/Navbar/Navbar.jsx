"use client";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

function NavLink({ link, onClick }) {
  return (
    <motion.a
      href={link.href}
      onClick={onClick}
      className="relative text-light-secondary hover:text-light-primary transition-colors duration-300 py-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {link.name}
      <motion.span
        className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gradient-purple to-gradient-pink origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.a>
  );
}

function MobileMenuButton({ isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden relative w-10 h-10 flex items-center justify-center"
      aria-label="Toggle menu"
    >
      <div className="relative w-6 h-5">
        <motion.span
          className="absolute left-0 w-full h-0.5 bg-light-primary rounded-full"
          animate={{
            top: isOpen ? "50%" : "0%",
            rotate: isOpen ? 45 : 0,
            y: isOpen ? "-50%" : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-light-primary rounded-full"
          animate={{ opacity: isOpen ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="absolute left-0 w-full h-0.5 bg-light-primary rounded-full"
          animate={{
            bottom: isOpen ? "50%" : "0%",
            rotate: isOpen ? -45 : 0,
            y: isOpen ? "50%" : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </button>
  );
}

function MobileMenu({ isOpen, onLinkClick }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute top-full left-0 right-0 md:hidden bg-dark-primary/95 backdrop-blur-lg border-b border-white/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={onLinkClick}
                className="text-light-secondary hover:text-light-primary transition-colors duration-300 text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {link.name}
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  // Background opacity based on scroll
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    const target = document.querySelector(href);

    // Close mobile menu first
    setIsMobileMenuOpen(false);

    // Scroll after a short delay to let menu close
    setTimeout(() => {
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0 bg-dark-primary/80 backdrop-blur-lg border-b border-white/10"
        style={{ opacity: bgOpacity }}
      />

      <nav className="relative container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          {isLandingPage ? (
            <motion.a
              href="#home"
              onClick={handleLinkClick}
              className="text-2xl font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="gradient-text">SH</span>
            </motion.a>
          ) : (
            <Link href="/">
              <motion.span
                className="text-2xl font-bold gradient-text"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                SH
              </motion.span>
            </Link>
          )}

          {/* Desktop Navigation - Only on landing page */}
          {isLandingPage && (
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink key={link.name} link={link} onClick={handleLinkClick} />
              ))}
            </div>
          )}

          {/* CTA Button - Only on landing page */}
          {isLandingPage && (
            <motion.a
              href="#contact"
              onClick={handleLinkClick}
              className="hidden md:block px-6 py-2 bg-gradient-to-r from-gradient-purple to-gradient-pink rounded-full text-white font-medium"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              Let's Talk
            </motion.a>
          )}

          {/* Mobile Menu Button - Only on landing page */}
          {isLandingPage && (
            <MobileMenuButton
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          )}
        </div>
      </nav>

      {/* Mobile Menu - Only on landing page */}
      {isLandingPage && (
        <MobileMenu isOpen={isMobileMenuOpen} onLinkClick={handleLinkClick} />
      )}
    </motion.header>
  );
}
