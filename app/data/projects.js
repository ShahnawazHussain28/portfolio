export const projects = [
  {
    slug: "web-steganography",
    title: "Web Steganography",
    shortDescription: "Hide and reveal secret messages inside images with optional password protection.",
    description: "A web-based steganography tool that lets you hide secret messages within images. Features password protection for added security.",
    longDescription: `A fascinating application of steganography - the art of hiding information in plain sight. This web tool allows users to encode secret messages directly into image pixels without visibly altering the image.

The encoding algorithm manipulates the least significant bits of pixel color values, making changes imperceptible to the human eye while storing your hidden data.

Features include optional password encryption for additional security, support for various image formats, and the ability to extract hidden messages from encoded images.`,
    image: "/thumbnails/steganography.jpg",
    images: [],
    youtubeId: null,
    technologies: ["JavaScript", "HTML5", "Canvas API", "CSS3"],
    features: [
      "Hide messages in images",
      "Password protection",
      "Multiple image format support",
      "Extract hidden messages",
      "No server upload required",
    ],
    liveUrl: "https://shahnawazhussain28.github.io/steganography/",
    githubUrl: "https://github.com/ShahnawazHussain28/ShahnawazHussain28.github.io/tree/main/steganography",
    category: "Web",
    featured: true,
    year: "2022",
    role: "Solo Developer",
  },
  {
    slug: "circuit-simulator",
    title: "Digital Circuit Simulator",
    shortDescription: "Interactive digital circuit simulator with drag-and-drop interface for learning electronics.",
    description: "Real-time digital circuit simulator with drag-and-drop interface. Build Adder circuits, 7-segment displays, or your own computer design.",
    longDescription: `An educational tool for learning digital electronics through hands-on experimentation. The simulator provides a virtual breadboard where users can place and connect various digital components.

Features include basic gates (AND, OR, NOT, XOR), flip-flops, multiplexers, decoders, and 7-segment displays. The real-time simulation engine provides immediate visual feedback as signals propagate through the circuit.

Pre-built examples include half adders, full adders, counters, and even a simple CPU design to inspire learners.`,
    image: "/thumbnails/circuitsim.jpg",
    images: [
      "/screenshots/circuitsim/circuitsim-1.png",
      "/screenshots/circuitsim/circuitsim-2.png",
      "/screenshots/circuitsim/circuitsim-3.png",
    ],
    youtubeId: null,
    technologies: ["JavaScript", "p5.js", "Canvas API"],
    features: [
      "Drag-and-drop interface",
      "Real-time signal simulation",
      "Pre-built circuit examples",
      "7-segment display support",
      "Build your own computer",
    ],
    liveUrl: "https://shahnawazhussain28.github.io/circuitsim/",
    githubUrl: "https://github.com/ShahnawazHussain28/ShahnawazHussain28.github.io/tree/main/circuitsim",
    category: "Web",
    featured: true,
    year: "2022",
    role: "Solo Developer",
  },
  {
    slug: "squid-game",
    title: "Squid Game - Survival Island",
    shortDescription: "3D survival game inspired by the hit Netflix series with four intense mini-games.",
    description: "Play as Player-456 through 4 games: Red Light Green Light, Sugar Honeycomb, Even Odd Marbles, and Glass Bridge.",
    longDescription: `A thrilling 3D survival game that brings the intense challenges from the popular Netflix series to life. Players take on the role of Player-456 and must survive through four increasingly difficult games.

Each mini-game faithfully recreates the tension of the show: timing your movements in Red Light Green Light, carefully carving shapes in Sugar Honeycomb, outsmarting opponents in Even Odd Marbles, and making life-or-death decisions on the Glass Bridge.

Features immersive 3D graphics, atmospheric sound design, and AI opponents that provide a challenging single-player experience.`,
    image: "/thumbnails/squidgame.jpg",
    images: [
      "/screenshots/squidgame/squidgame-1.jpg",
      "/screenshots/squidgame/squidgame-2.jpg",
      "/screenshots/squidgame/squidgame-3.jpg",
      "/screenshots/squidgame/squidgame-4.jpg",
      "/screenshots/squidgame/squidgame-5.jpg",
      "/screenshots/squidgame/squidgame-6.jpg",
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
    liveUrl: "https://shahnawazhussain28.github.io/squidgame/",
    githubUrl: null,
    category: "Game",
    featured: true,
    year: "2022",
    role: "Game Developer",
  },
  {
    slug: "solar-system",
    title: "Solar System Visualization",
    shortDescription: "Interactive 3D visualization of our Solar System with accurate orbital mechanics.",
    description: "How does our Solar System work? See the killer visualization with accurate planet sizes, distances, and orbital periods.",
    longDescription: `An educational and visually stunning representation of our Solar System. This interactive visualization shows all eight planets orbiting the Sun with relatively accurate sizes, distances, and orbital speeds.

Users can zoom in and out, click on planets to learn interesting facts, and watch the elegant dance of celestial bodies around our star.

The simulation includes asteroid belts, planetary moons, and even shows the relative tilt of planetary axes.`,
    image: "/thumbnails/solarsystem.jpg",
    images: [],
    youtubeId: null,
    technologies: ["JavaScript", "p5.js", "WebGL"],
    features: [
      "Accurate orbital mechanics",
      "Interactive planet info",
      "Zoom and pan controls",
      "Moon visualization",
      "Real-time animation",
    ],
    liveUrl: "https://shahnawazhussain28.github.io/solarsystem/",
    githubUrl: "https://github.com/ShahnawazHussain28/ShahnawazHussain28.github.io/tree/main/solarsystem",
    category: "Web",
    featured: false,
    year: "2021",
    role: "Solo Developer",
  },
  {
    slug: "maze-generator",
    title: "Maze Generator & Solver",
    shortDescription: "Generate beautiful mazes and watch AI solve them with various pathfinding algorithms.",
    description: "Generate pleasing mazes and try to solve them yourself or let the program solve using different algorithms.",
    longDescription: `A fascinating exploration of maze generation and solving algorithms. Watch as perfect mazes are generated using recursive backtracking, then see various pathfinding algorithms race to find the solution.

The generator creates solvable mazes of any size with guaranteed single solutions. Choose from multiple solving algorithms including Depth-First Search, Breadth-First Search, and A* to see their different approaches.

Visual animations show exactly how each algorithm explores the maze, making it an excellent educational tool for understanding search algorithms.`,
    image: "/thumbnails/mazegenerator.jpg",
    images: [],
    youtubeId: null,
    technologies: ["JavaScript", "p5.js", "Algorithms"],
    features: [
      "Recursive backtracking generation",
      "Multiple solving algorithms",
      "Visual algorithm animation",
      "Adjustable maze size",
      "Speed control",
    ],
    liveUrl: "https://shahnawazhussain28.github.io/mazegenerator/",
    githubUrl: "https://github.com/ShahnawazHussain28/ShahnawazHussain28.github.io/tree/main/mazegenerator",
    category: "Web",
    featured: false,
    year: "2021",
    role: "Solo Developer",
  },
  {
    slug: "game-of-life",
    title: "Conway's Game of Life",
    shortDescription: "Interactive implementation of the famous cellular automaton with custom patterns.",
    description: "Defined by only 3 simple rules but playing with this is FUN. Create patterns and watch them evolve.",
    longDescription: `An interactive implementation of John Conway's famous cellular automaton. Despite being governed by just three simple rules, the Game of Life produces incredibly complex and beautiful patterns.

Draw your own starting patterns or choose from classic configurations like gliders, spaceships, and oscillators. Watch as your creation evolves through generations, sometimes stabilizing, sometimes creating infinite growth.

The simulation includes speed controls, step-by-step mode, and the ability to save and load patterns.`,
    image: "/thumbnails/gameoflife.png",
    images: [],
    youtubeId: null,
    technologies: ["JavaScript", "p5.js", "Canvas API"],
    features: [
      "Interactive cell drawing",
      "Classic pattern presets",
      "Speed and step controls",
      "Infinite grid simulation",
      "Pattern save/load",
    ],
    liveUrl: "https://shahnawazhussain28.github.io/gameoflife/",
    githubUrl: "https://github.com/ShahnawazHussain28/ShahnawazHussain28.github.io/tree/main/gameoflife",
    category: "Web",
    featured: false,
    year: "2021",
    role: "Solo Developer",
  },
  {
    slug: "stack-blocks",
    title: "Stack Blocks 3D",
    shortDescription: "Addictive 3D stacking game - test your timing and see how high you can go!",
    description: "A full 3D game without installing. Let's see how high you can stack. Perfect timing required!",
    longDescription: `A simple yet incredibly addictive 3D game that tests your timing and precision. Blocks swing back and forth - tap at the perfect moment to stack them on top of each other.

Miss the timing and your block gets trimmed, making subsequent stacks more challenging. The game gets progressively harder as your tower grows taller and the blocks move faster.

Features smooth 3D graphics, satisfying sound effects, and a high score system to track your best attempts.`,
    image: "/thumbnails/stackblocks.jpg",
    images: [],
    youtubeId: null,
    technologies: ["JavaScript", "p5.js", "WebGL"],
    features: [
      "Smooth 3D graphics",
      "Progressive difficulty",
      "High score tracking",
      "Satisfying physics",
      "One-tap controls",
    ],
    liveUrl: "https://shahnawazhussain28.github.io/stackblocks/",
    githubUrl: "https://github.com/ShahnawazHussain28/ShahnawazHussain28.github.io/tree/main/stackblocks",
    category: "Game",
    featured: false,
    year: "2021",
    role: "Solo Developer",
  },
  {
    slug: "asteroids",
    title: "Asteroids",
    shortDescription: "Classic arcade game remake - destroy asteroids with your laser beam!",
    description: "Destroy the asteroids with laser beam and help the spaceship survive. How long can you last?",
    longDescription: `A faithful recreation of the classic arcade game that defined a generation. Pilot your spaceship through an asteroid field, blasting rocks into smaller pieces while avoiding collisions.

The game features authentic physics with momentum-based movement, screen wrapping, and increasingly challenging waves of asteroids.

Power-ups, shields, and special weapons add modern touches while preserving the nostalgic feel of the original.`,
    image: "/thumbnails/asteroids.jpg",
    images: [],
    youtubeId: null,
    technologies: ["JavaScript", "p5.js", "Game Physics"],
    features: [
      "Classic arcade gameplay",
      "Momentum-based physics",
      "Progressive difficulty",
      "Screen wrapping",
      "High score system",
    ],
    liveUrl: "https://shahnawazhussain28.github.io/asteroids/",
    githubUrl: "https://github.com/ShahnawazHussain28/ShahnawazHussain28.github.io/tree/main/asteroids",
    category: "Game",
    featured: false,
    year: "2021",
    role: "Solo Developer",
  },
  {
    slug: "tic-tac-toe-ai",
    title: "Tic-Tac-Toe AI",
    shortDescription: "Play against an AI that learns your patterns using machine learning.",
    description: "Play this nostalgic game with AI pattern detection. The AI learns from your moves!",
    longDescription: `A modern take on the classic game featuring an AI opponent that uses pattern recognition to learn and adapt to your playing style.

The AI analyzes your move history and attempts to predict your strategy, becoming more challenging the more you play. It uses a combination of minimax algorithm and pattern matching for optimal play.

Multiple difficulty levels let beginners enjoy the game while experts can challenge themselves against the unbeatable hard mode.`,
    image: "/thumbnails/tictactoe.jpg",
    images: [],
    youtubeId: null,
    technologies: ["JavaScript", "p5.js", "ml5.js", "Machine Learning"],
    features: [
      "AI pattern recognition",
      "Multiple difficulty levels",
      "Learning algorithm",
      "Move prediction",
      "Win/loss statistics",
    ],
    liveUrl: "https://shahnawazhussain28.github.io/tictactoe/",
    githubUrl: "https://github.com/ShahnawazHussain28/ShahnawazHussain28.github.io/tree/main/tictactoe",
    category: "Game",
    featured: false,
    year: "2021",
    role: "Solo Developer",
  },
  {
    slug: "unfair-chat",
    title: "Unfair Chat",
    shortDescription: "Chat app with a twist - see who your friends are chatting with in real-time.",
    description: "Full-featured chat app with a twist! See friends' online status and who they're currently talking to.",
    longDescription: `A unique take on the traditional chat application that adds an element of fun and transparency. While providing all standard messaging features, Unfair Chat lets you peek into your friends' conversations.

See who's online, who they're currently chatting with, and even watch as they type their messages in real-time. It's designed for close friend groups who want a more open and playful communication experience.

Features include customizable profiles, group chats, emoji reactions, and a beautiful dark mode interface.`,
    image: "/thumbnails/unfairchat.jpg",
    images: [],
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
    slug: "morse-code",
    title: "Morse Code Translator",
    shortDescription: "Translate text to Morse code with audio playback and visual signals.",
    description: "Use the famous Morse code with tons of functionalities including audio and visual output.",
    longDescription: `A comprehensive Morse code tool that lets you encode and decode messages using the international Morse code standard.

Type your message and hear it played back as authentic Morse code beeps. The visual display shows dots and dashes in real-time, making it perfect for learning Morse code.

Features include adjustable speed, frequency control, and the ability to decode incoming Morse signals by listening to audio input.`,
    image: "/thumbnails/morsecode.jpg",
    images: [],
    youtubeId: null,
    technologies: ["JavaScript", "Web Audio API", "HTML5", "CSS3"],
    features: [
      "Text to Morse conversion",
      "Audio playback",
      "Visual signal display",
      "Adjustable speed",
      "Decode mode",
    ],
    liveUrl: "https://shahnawazhussain28.github.io/morsecode/",
    githubUrl: "https://github.com/ShahnawazHussain28/ShahnawazHussain28.github.io/tree/main/morsecode",
    category: "Web",
    featured: false,
    year: "2021",
    role: "Solo Developer",
  },
  {
    slug: "fractal-tree",
    title: "Fractal Tree Generator",
    shortDescription: "Generate beautiful recursive fractal trees with customizable parameters.",
    description: "A completely symmetric tree you want to look at. Can be asymmetric too with adjustable parameters.",
    longDescription: `Explore the beauty of recursion with this interactive fractal tree generator. Adjust parameters like branch angle, length ratio, and recursion depth to create unique tree patterns.

Watch in real-time as your adjustments transform the tree from symmetric perfection to wild, organic asymmetry. The color gradient feature adds an extra dimension of beauty to your creations.

Perfect for understanding recursive algorithms while creating stunning mathematical art.`,
    image: "/thumbnails/fractaltree.jpg",
    images: [],
    youtubeId: null,
    technologies: ["JavaScript", "p5.js", "Recursion"],
    features: [
      "Adjustable branch angles",
      "Recursion depth control",
      "Color gradients",
      "Symmetry toggle",
      "Real-time preview",
    ],
    liveUrl: "https://shahnawazhussain28.github.io/fractaltree/",
    githubUrl: "https://github.com/ShahnawazHussain28/ShahnawazHussain28.github.io/tree/main/fractaltree",
    category: "Web",
    featured: false,
    year: "2021",
    role: "Solo Developer",
  },
];
