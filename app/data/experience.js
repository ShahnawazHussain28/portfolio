export const experiences = [
  {
    company: "Bharathaap Technologies",
    org: "IIT Hyderabad",
    position: "AI/ML Engineer",
    period: "May 2026 - Present",
    link: { label: "nimbanaturecure.in", href: "https://nimbanaturecure.in" },
    description:
      "Building the apps behind Nimba Nature Cure: a patient app that runs health tests on the phone itself, and the portal that runs the hospital.",
    achievements: [
      "Built the patient app for Android and iOS in Expo (React Native): health assessments, consultation and stay booking, therapy and diet schedules, and a bilingual voice assistant",
      "Wrote native Android and iOS modules that run MediaPipe pose tracking on the phone's GPU to score guided movement tests with spoken coaching, and read heart rate and HRV from fingertip camera video",
      "Turned clinicians' assessment matrices into a scoring engine that combines LLM-read blood reports, questionnaires, cognitive games and camera tests into health scores and a biological-age estimate",
      "Built most of the Next.js hospital portal: reservations and billing with PDF invoices, diet and therapy planners, kitchen and procurement, and HR",
    ],
    technologies: ["Expo", "React Native", "MediaPipe", "Next.js", "LLMs", "TypeScript"],
    stats: [{ from: 0, to: 12, label: "staff roles run the hospital on the portal" }],
  },
  {
    company: "VTAKU",
    position: "Software Engineer",
    period: "September 2024 - February 2026",
    link: { label: "wargameshq.com", href: "https://wargameshq.com" },
    description:
      "Led a team of 5 building WargamesHQ, a platform where players matchmake and play hex and grid tactical wargames, live or asynchronously.",
    achievements: [
      "Designed a stateless TypeScript rules engine that runs any wargame from a JSON config (units, terrain, cards, turn phases), so designers publish new games without code",
      "Built an LLM copilot (OpenAI, Anthropic, Gemini) that edits game configs through tool calls and schema-validated JSON patches. A new game went from 4 weeks with 2 developers to hours for one designer",
      "Replaced boardgame.io with a custom Socket.IO server that queues each match's moves to resolve conflicts and writes state atomically to Postgres, with async play, turn timers and notifications",
      "Built and optimised the database for Gozango, a marketing CRM for home-services businesses",
    ],
    technologies: ["TypeScript", "Socket.IO", "PostgreSQL", "LLM agents", "React", "Node.js"],
    stats: [
      { before: 12, beforeUnit: "days", after: 5, unit: "min", label: "for a Gozango job over millions of rows" },
      { from: 0, to: 5, label: "developers led" },
    ],
  },
  {
    company: "Gauge RO",
    position: "Web Developer Intern",
    period: "July 2023 - August 2024",
    link: { label: "gauge.ro", href: "https://gauge.ro" },
    description: "Built the cloud side of Gauge's smart water purifiers, and the apps people use to look after them.",
    achievements: [
      "Built the cloud backend for the purifiers, handling real-time, two-way communication with 500+ devices over MQTT and Kafka",
      "Built two PWAs, one for customers to monitor and troubleshoot their purifier and one for technicians to manage service tickets, plus the company website",
      "Automated remote failure-scenario testing for the purifiers",
    ],
    technologies: ["Node.js", "MQTT", "Kafka", "React", "PWA", "PostgreSQL"],
    stats: [
      { before: 5, after: 0, unit: "hrs", label: "of manual testing a day, after automating it" },
      { from: 0, to: 500, suffix: "+", label: "purifiers connected to the backend" },
    ],
  },
];
