"use client";
import { motion } from "framer-motion";
import { SiGithub, SiLinkedin, SiYoutube, SiFacebook } from "react-icons/si";

const socialLinks = [
  {
    name: "GitHub",
    icon: SiGithub,
    url: "https://github.com/ShahnawazHussain28",
    color: "#333",
    hoverColor: "from-gray-600 to-gray-800",
  },
  {
    name: "LinkedIn",
    icon: SiLinkedin,
    url: "https://www.linkedin.com/in/shahnawaz2802",
    color: "#0A66C2",
    hoverColor: "from-blue-500 to-blue-700",
  },
  {
    name: "YouTube",
    icon: SiYoutube,
    url: "https://www.youtube.com/@codeuniverse9015",
    color: "#FF0000",
    hoverColor: "from-red-500 to-red-700",
  },
  {
    name: "Facebook",
    icon: SiFacebook,
    url: "https://www.facebook.com/Shahnawaz.2802",
    color: "#1877F2",
    hoverColor: "from-blue-600 to-blue-800",
  },
];

function SocialIcon({ social, index }) {
  const Icon = social.icon;

  return (
    <motion.a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Background glow */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${social.hoverColor} rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
      />

      {/* Icon container */}
      <div className="relative w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all duration-300 overflow-hidden">
        {/* Hover background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${social.hoverColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />

        {/* Icon */}
        <Icon className="w-6 h-6 text-light-secondary group-hover:text-white relative z-10 transition-colors duration-300" />

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
        />
      </div>

      {/* Tooltip */}
      <motion.span
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-white/10 backdrop-blur-sm rounded text-xs text-light-secondary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
      >
        {social.name}
      </motion.span>
    </motion.a>
  );
}

export default function SocialLinks() {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-light-primary">Follow Me</h4>
      <div className="flex gap-4">
        {socialLinks.map((social, index) => (
          <SocialIcon key={social.name} social={social} index={index} />
        ))}
      </div>
    </div>
  );
}
