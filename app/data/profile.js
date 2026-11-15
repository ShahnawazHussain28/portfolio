export const profile = {
  name: "Shahnawaz Hussain",
  role: "Software engineer, full-stack and AI/ML",
  email: "shahnawazhussain2802@gmail.com",
  links: [
    { label: "GitHub", href: "https://github.com/ShahnawazHussain28" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/shahnawazhussain28" },
    { label: "YouTube", href: "https://www.youtube.com/@codeuniverse9015" },
  ],
};

export const recognition = [
  {
    place: "1st",
    event: "Xcelerate Oracle APEX hackathon",
    note: "National hackathon. Won with SnugShopper, an AI apparel-fitting system.",
    year: "2024",
    photo: "/awards/oracle.jpg",
    post: "https://www.linkedin.com/posts/shahnawaz2802_oracle-oraclapex-inoaug-ugcPost-7234086773495058432-uBD9/",
    photoPosition: "55% 40%", // the team, trophy and cheque sit right of centre
    fallback: "/thumbnails/snugshopper.jpg",
    href: "/projects/snugshopper",
    linkLabel: "See SnugShopper",
    palette: "award-first",
  },
  {
    place: "Top 3",
    event: "Cognizant Digital Nurture Technoverse",
    note: "National finals.",
    year: "2024",
    photo: "/awards/cognizant.jpg",
    post: "https://www.linkedin.com/posts/shahnawaz2802_cognizant-digitalnurture-technoverse2024-ugcPost-7400884671829590016-fUYG/",
    photoPosition: "50% 45%",
    palette: "award-top",
  },
];

export const stack = [
  {
    area: "Web and backend",
    items: ["TypeScript", "React", "Next.js", "Node.js", "Express", "tRPC", "Socket.IO", "PostgreSQL", "Drizzle", "Prisma", "Redis"],
  },
  {
    area: "AI and audio",
    items: ["Python", "FastAPI", "LLM agents", "Tool calling", "MCP", "Claude Code", "MediaPipe", "OpenCV", "Whisper", "IndexTTS-2"],
  },
  {
    area: "Mobile and 3D",
    items: ["React Native", "Expo native modules", "Three.js", "Unity", "C#"],
  },
  {
    area: "Systems",
    items: ["C++", "MQTT", "Kafka", "Docker", "Cloudflare Workers", "GitHub Actions"],
  },
];
