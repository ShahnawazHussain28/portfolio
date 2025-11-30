export const projects = [
  {
    slug: "gauge-ecommerce",
    title: "Gauge Ecommerce Website",
    shortDescription: "Fully functional eCommerce website with user-friendly landing page and seamless purchase experience.",
    description: "Fully functional eCommerce website with user-friendly landing page, blog section, and seamless purchase experience for Gauge RO products with detailed descriptions and customer reviews.",
    longDescription: `A comprehensive eCommerce solution built from the ground up for Gauge RO products. The platform features a modern, responsive design that provides an exceptional shopping experience across all devices.

Key features include a dynamic product catalog with advanced filtering, a seamless checkout process, integrated payment gateway, inventory management system, and a full-featured blog section for content marketing.

The admin dashboard provides real-time analytics, order management, and customer relationship tools to help the business grow.`,
    image: "/screenshots/ecommerce-short.png",
    images: [
      "/screenshots/ecommerce-short.png",
      "/screenshots/ecommerce-short.png",
      "/screenshots/ecommerce-short.png",
      "/screenshots/ecommerce-short.png",
    ],
    youtubeId: null,
    technologies: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
    features: [
      "Responsive product catalog with filtering",
      "Secure checkout with payment integration",
      "Admin dashboard with analytics",
      "Blog section for content marketing",
      "Customer reviews and ratings",
    ],
    liveUrl: "https://gauge.komsup.com",
    githubUrl: null,
    category: "Web",
    featured: true,
    year: "2024",
    role: "Full Stack Developer",
  },
  {
    slug: "consumer-app",
    title: "Consumer App",
    shortDescription: "PWA for Smart Water Purifier customers to monitor and control their RO remotely.",
    description: "PWA for Smart Water Purifier customers to view purifier data, operate RO remotely, and perform complex troubleshooting. Includes FAQ, tutorials, and issues section.",
    longDescription: `A Progressive Web Application designed to give Smart Water Purifier customers complete control over their devices. The app connects to IoT-enabled water purifiers via WebSocket for real-time data streaming and remote control capabilities.

Users can monitor water quality metrics, filter life, and usage statistics in real-time. The app also features a comprehensive troubleshooting guide with step-by-step instructions and video tutorials.

Push notifications keep users informed about filter replacements, maintenance schedules, and system alerts.`,
    image: "/screenshots/consumerapp-short.png",
    images: [
      "/screenshots/consumerapp-short.png",
    ],
    youtubeId: null,
    technologies: ["React", "PWA", "Node.js", "MongoDB", "WebSocket"],
    features: [
      "Real-time device monitoring",
      "Remote control capabilities",
      "Push notifications",
      "Interactive troubleshooting",
      "Video tutorials and FAQ",
    ],
    liveUrl: "https://pwa2.komsup.com/",
    githubUrl: null,
    category: "Mobile",
    featured: false,
    year: "2024",
    role: "Frontend Developer",
  },
  {
    slug: "technician-app",
    title: "Technician App",
    shortDescription: "Field service management PWA for technicians with task tracking and team coordination.",
    description: "PWA for technicians to manage teams and assigned tasks. Features task assignment, ticket status tracking, revisiting, and rescheduling functionality.",
    longDescription: `A comprehensive field service management application built as a Progressive Web App for optimal mobile performance. Technicians can view their daily schedules, navigate to customer locations, and update job statuses in real-time.

The app includes intelligent routing suggestions, parts inventory tracking, and the ability to capture customer signatures digitally. Team leads can assign and redistribute tasks based on technician availability and location.

Offline support ensures technicians can access critical information even in areas with poor connectivity.`,
    image: "/screenshots/pegapp-short.png",
    images: [
      "/screenshots/pegapp-short.png",
    ],
    youtubeId: null,
    technologies: ["React", "PWA", "Firebase", "Material-UI"],
    features: [
      "Task assignment and tracking",
      "Real-time status updates",
      "Offline support",
      "Digital signature capture",
      "Team coordination tools",
    ],
    liveUrl: "https://pegpwa.komsup.com/",
    githubUrl: null,
    category: "Mobile",
    featured: false,
    year: "2023",
    role: "Frontend Developer",
  },
  {
    slug: "digital-circuit-simulator",
    title: "Digital Circuit Simulator",
    shortDescription: "Interactive digital circuit simulator with drag-and-drop interface for learning electronics.",
    description: "Real-time digital circuit simulator with drag-and-drop interface. Build Adder circuits, 7-segment displays, or your own computer design.",
    longDescription: `An educational tool for learning digital electronics through hands-on experimentation. The simulator provides a virtual breadboard where users can place and connect various digital components.

Features include basic gates (AND, OR, NOT, XOR), flip-flops, multiplexers, decoders, and 7-segment displays. The real-time simulation engine provides immediate visual feedback as signals propagate through the circuit.

Pre-built examples include half adders, full adders, counters, and even a simple CPU design to inspire learners.`,
    image: "/screenshots/circuitsim-short.png",
    images: [
      "/screenshots/circuitsim-short.png",
    ],
    youtubeId: null,
    technologies: ["JavaScript", "Canvas API", "HTML5", "CSS3"],
    features: [
      "Drag-and-drop interface",
      "Real-time signal simulation",
      "Pre-built circuit examples",
      "Export and share designs",
      "Interactive tutorials",
    ],
    liveUrl: "https://shahnawazhussain28.github.io/circuitsim/",
    githubUrl: "https://github.com/ShahnawazHussain28/ShahnawazHussain28.github.io/tree/main/circuitsim",
    category: "Web",
    featured: false,
    year: "2022",
    role: "Solo Developer",
  },
  {
    slug: "squid-game-survival-island",
    title: "Squid Game - Survival Island",
    shortDescription: "3D survival game inspired by the hit Netflix series with four intense mini-games.",
    description: '3D survival game made with Unity based on "Squid Game" series. Play as Player-456 through 4 games: Red Light Green Light, Sugar Honeycomb, Even Odd Marbles, and Glass Bridge.',
    longDescription: `A thrilling 3D survival game that brings the intense challenges from the popular Netflix series to life. Players take on the role of Player-456 and must survive through four increasingly difficult games.

Each mini-game faithfully recreates the tension of the show: timing your movements in Red Light Green Light, carefully carving shapes in Sugar Honeycomb, outsmarting opponents in Even Odd Marbles, and making life-or-death decisions on the Glass Bridge.

Features immersive 3D graphics, atmospheric sound design, and AI opponents that provide a challenging single-player experience.`,
    image: "/screenshots/squidgame-short.png",
    images: [
      "/screenshots/squidgame-short.png",
    ],
    youtubeId: null,
    technologies: ["Unity", "C#", "3D Modeling", "Game Design"],
    features: [
      "Four unique mini-games",
      "Immersive 3D graphics",
      "AI opponents",
      "Atmospheric sound design",
      "Progressive difficulty",
    ],
    liveUrl: null,
    githubUrl: null,
    category: "Game",
    featured: false,
    year: "2022",
    role: "Game Developer",
  },
  {
    slug: "whatsy-whatsapp-bot",
    title: "Whatsy - WhatsApp Bot",
    shortDescription: "AI-powered WhatsApp bot for answering questions, finding images, and more.",
    description: "AI-powered WhatsApp bot that answers questions, finds images, translates languages, discovers music, and solves math problems. Powered by Google and DuckDuckGo APIs.",
    longDescription: `An intelligent WhatsApp bot that brings the power of AI directly to your chats. Simply message the bot with your queries and get instant responses powered by multiple AI and search APIs.

Features include natural language question answering, image search with instant delivery, language translation supporting 100+ languages, music discovery with preview links, and step-by-step math problem solving.

The bot uses advanced natural language processing to understand context and provide relevant, helpful responses.`,
    image: "/screenshots/whatsy-1.jpeg",
    images: [
      "/screenshots/whatsy-1.jpeg",
    ],
    youtubeId: null,
    technologies: ["Node.js", "WhatsApp API", "Google API", "AI"],
    features: [
      "Natural language Q&A",
      "Image search and delivery",
      "Multi-language translation",
      "Music discovery",
      "Math problem solver",
    ],
    liveUrl: null,
    githubUrl: "https://github.com/ShahnawazHussain28/whatsapp-bot",
    category: "AI/ML",
    featured: false,
    year: "2021",
    role: "Solo Developer",
  },
  {
    slug: "unfair-chat",
    title: "Unfair Chat",
    shortDescription: "Chat app with a twist - see who your friends are chatting with in real-time.",
    description: "Full-featured chat app with a twist! See friends' online status, change profile pictures, and have fun seeing who they're talking to and what they're typing.",
    longDescription: `A unique take on the traditional chat application that adds an element of fun and transparency. While providing all standard messaging features, Unfair Chat lets you peek into your friends' conversations.

See who's online, who they're currently chatting with, and even watch as they type their messages in real-time. It's designed for close friend groups who want a more open and playful communication experience.

Features include customizable profiles, group chats, emoji reactions, and a beautiful dark mode interface.`,
    image: "/screenshots/unfairchat-short.png",
    images: [
      "/screenshots/unfairchat-short.png",
    ],
    youtubeId: null,
    technologies: ["React", "Socket.io", "Node.js", "MongoDB", "Express"],
    features: [
      "Real-time typing indicators",
      "See active conversations",
      "Online status tracking",
      "Group chat support",
      "Customizable profiles",
    ],
    liveUrl: "https://unfairchat.onrender.com",
    githubUrl: "https://github.com/ShahnawazHussain28/unfair-chat-react/",
    category: "Web",
    featured: false,
    year: "2021",
    role: "Full Stack Developer",
  },
  {
    slug: "automated-integration-testing",
    title: "Automated Integration Testing",
    shortDescription: "Comprehensive testing automation saving 5+ hours of manual testing daily.",
    description: "Complete testing environment for Smart RO with flows for every possible failure. Saves 5 hours of manual testing per day.",
    longDescription: `A comprehensive automated testing framework designed specifically for Smart RO IoT devices. The system simulates every possible user interaction and failure scenario to ensure product reliability.

The test suite includes hardware-in-the-loop testing, API endpoint validation, WebSocket connection stability tests, and end-to-end user flow simulations.

Automated reports are generated after each test run, highlighting any regressions or new issues, significantly reducing the QA team's workload.`,
    image: "/screenshots/testing-short.jpg",
    images: [
      "/screenshots/testing-short.jpg",
    ],
    youtubeId: null,
    technologies: ["Selenium", "Python", "Jest", "Automation"],
    features: [
      "Hardware-in-the-loop testing",
      "API endpoint validation",
      "WebSocket stability tests",
      "Automated reporting",
      "CI/CD integration",
    ],
    liveUrl: null,
    githubUrl: null,
    category: "Other",
    featured: false,
    year: "2023",
    role: "QA Engineer",
  },
];
