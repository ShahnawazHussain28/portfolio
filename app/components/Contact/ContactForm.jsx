"use client";
import { motion } from "framer-motion";
import { useState, useRef } from "react";

// Floating label input component
function FloatingInput({ label, type = "text", name, required = false }) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const isActive = isFocused || isHovered;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect - outer glow only */}
      <motion.div
        className="absolute -inset-1 rounded-xl opacity-0 pointer-events-none"
        animate={{
          opacity: isFocused ? 1 : isHovered ? 0.5 : 0,
          boxShadow: isFocused
            ? "0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.2)"
            : "0 0 15px rgba(139, 92, 246, 0.3)",
        }}
        transition={{ duration: 0.3 }}
      />

      <input
        type={type}
        name={name}
        required={required}
        className="w-full px-4 pt-6 pb-2 bg-white/5 border border-white/10 rounded-xl text-light-primary placeholder-transparent focus:outline-none focus:border-gradient-purple/50 transition-all duration-300"
        placeholder={label}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          setHasValue(e.target.value !== "");
        }}
        onChange={(e) => setHasValue(e.target.value !== "")}
      />
      <motion.label
        className="absolute left-4 pointer-events-none font-medium"
        initial={false}
        animate={{
          top: isFocused || hasValue ? "6px" : "16px",
          fontSize: isFocused || hasValue ? "11px" : "16px",
          color: isFocused || hasValue
            ? "rgb(139, 92, 246)"
            : isActive
              ? "rgba(232, 234, 240, 0.8)"
              : "rgba(232, 234, 240, 0.5)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {label}
      </motion.label>
    </div>
  );
}

// Floating label textarea component
function FloatingTextarea({ label, name, required = false }) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const isActive = isFocused || isHovered;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect - outer glow only */}
      <motion.div
        className="absolute -inset-1 rounded-xl opacity-0 pointer-events-none"
        animate={{
          opacity: isFocused ? 1 : isHovered ? 0.5 : 0,
          boxShadow: isFocused
            ? "0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.2)"
            : "0 0 15px rgba(139, 92, 246, 0.3)",
        }}
        transition={{ duration: 0.3 }}
      />

      <textarea
        name={name}
        required={required}
        rows={5}
        className="w-full px-4 pt-6 pb-2 bg-white/5 border border-white/10 rounded-xl text-light-primary placeholder-transparent focus:outline-none focus:border-gradient-purple/50 transition-all duration-300 resize-none"
        placeholder={label}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          setHasValue(e.target.value !== "");
        }}
        onChange={(e) => setHasValue(e.target.value !== "")}
      />
      <motion.label
        className="absolute left-4 pointer-events-none font-medium"
        initial={false}
        animate={{
          top: isFocused || hasValue ? "6px" : "16px",
          fontSize: isFocused || hasValue ? "11px" : "16px",
          color: isFocused || hasValue
            ? "rgb(139, 92, 246)"
            : isActive
              ? "rgba(232, 234, 240, 0.8)"
              : "rgba(232, 234, 240, 0.5)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {label}
      </motion.label>
    </div>
  );
}

// Magnetic button
function MagneticButton({ children, type = "button" }) {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePosition({ x: x * 0.08, y: y * 0.08 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      className="relative w-full py-4 px-8 bg-gradient-to-r from-gradient-purple via-gradient-pink to-gradient-blue rounded-xl font-semibold text-white overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "100%" : "-100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
        <motion.svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </motion.svg>
      </span>
    </motion.button>
  );
}

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFormFocused, setIsFormFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    formData.append("access_key", "f4cc8bf9-69e2-4172-87dc-7f11541a5f64");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        e.target.reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative group">
      {/* Glassmorphic card */}
      <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        {/* Gradient border effect */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-gradient-purple/20 via-gradient-pink/20 to-gradient-blue/20 transition-opacity duration-500 -z-10 blur-xl ${isFormFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

        {isSubmitted ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                />
              </svg>
            </motion.div>
            <h3 className="text-2xl font-bold text-light-primary mb-2">
              Message Sent!
            </h3>
            <p className="text-light-secondary/70">
              Thanks for reaching out. I&apos;ll get back to you soon!
            </p>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            onFocus={() => setIsFormFocused(true)}
            onBlur={() => setIsFormFocused(false)}
            className="space-y-6"
          >
            <FloatingInput label="Your Name" name="name" required />
            <FloatingInput label="Email Address" type="email" name="email" required />
            <FloatingInput label="Subject" name="subject" />
            <FloatingTextarea label="Your Message" name="message" required />

            <MagneticButton type="submit">
              {isSubmitting ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                "Send Message"
              )}
            </MagneticButton>
          </form>
        )}
      </div>
    </div>
  );
}
