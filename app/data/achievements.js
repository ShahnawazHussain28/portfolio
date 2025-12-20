export const achievements = [
  {
    id: 1,
    title: "Champion",
    subtitle: "1st Place",
    event: "Xcelerate 2024",
    description: "India's Premier Oracle APEX Hackathon",
    year: "2024",
    icon: "trophy", // gold trophy
    color: {
      primary: "#FFD700",
      secondary: "#FFA500",
      glow: "rgba(255, 215, 0, 0.6)",
    },
    stats: {
      position: 1,
      label: "Champion",
    },
  },
  {
    id: 2,
    title: "Finalist",
    subtitle: "Top 5",
    event: "Cognizant Digital Nurture Technoverse 2024",
    description: "National Level Hackathon",
    year: "2024",
    icon: "medal", // silver medal
    color: {
      primary: "#C0C0C0",
      secondary: "#A8A8A8",
      glow: "rgba(192, 192, 192, 0.6)",
    },
    stats: {
      position: 5,
      label: "Finalist",
    },
  },
];

export const achievementStages = [
  {
    id: "intro",
    scrollRange: [0, 0.2],
    content: {
      headline: "2024",
      subheadline: "The Year of Victories",
    },
  },
  {
    id: "trophy1",
    scrollRange: [0.2, 0.5],
    achievementIndex: 0,
  },
  {
    id: "trophy2",
    scrollRange: [0.5, 0.8],
    achievementIndex: 1,
  },
  {
    id: "finale",
    scrollRange: [0.8, 1],
    content: {
      headline: "Back to Back",
      subheadline: "National Recognition",
    },
  },
];
