export interface Project {
  title: string;
  description: string;
  tags: string[];
  category: "frontend" | "backend" | "fullstack" | "opensource";
  hook?: string;
  image?: string;
  github?: string;
  live?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: "SalarySync",
    hook: "A payroll system where admins pay and employees only see their own records.",
    description:
      "Built with Laravel. Admins create employee records and process salaries. Employees see their payment history and personal details, and nothing else.",
    tags: ["Laravel", "PHP", "Blade", "Tailwind CSS", "Vite"],
    category: "fullstack",
    image: "/assets/paintings/painting_0.webp",
    github: "https://github.com/Akash-Kumar-S5/SalarySync",
    featured: true,
  },
  {
    title: "Rentify",
    hook: "A rental listings site, split into a client and a server.",
    description:
      "A full-stack rental platform in JavaScript. The frontend client and the backend server are separate services that manage the listings.",
    tags: ["JavaScript", "Node.js", "HTML", "CSS"],
    category: "fullstack",
    image: "/assets/paintings/painting_1.webp",
    github: "https://github.com/Akash-Kumar-S5/Rentify",
    featured: true,
  },
  {
    title: "Website Performance Monitor",
    hook: "A dashboard that tracks how fast a website loads.",
    description:
      "A frontend dashboard and a backend service that collect a site’s performance numbers and show how they change.",
    tags: ["JavaScript", "Node.js", "CSS"],
    category: "fullstack",
    image: "/assets/paintings/painting_2.webp",
    github: "https://github.com/Akash-Kumar-S5/website-performance-monitor",
    featured: true,
  },
  {
    title: "Innovation Sprint 2025",
    hook: "A research agent in Python, built over five weekly sprints at Presidio.",
    description:
      "A sprint project at Presidio, organised across five weeks. It includes a research agent written in Python, with some JavaScript around it.",
    tags: ["Python", "JavaScript", "AI", "Research"],
    category: "opensource",
    image: "/assets/paintings/painting_3.webp",
    github: "https://github.com/Akash-Kumar-S5/Innovation-sprint-2025",
    featured: false,
  },
  {
    title: "MediHub",
    hook: "A clinic website with sign-in, a contact form and a list of services.",
    description:
      "A healthcare services site with user authentication, contact forms, and a plain layout for medical service information.",
    tags: ["HTML", "CSS", "JavaScript"],
    category: "frontend",
    image: "/assets/paintings/painting_4.webp",
    github: "https://github.com/Akash-Kumar-S5/MediHub.github.io",
    live: "https://akash-kumar-s5.github.io/MediHub.github.io/",
    featured: false,
  },
  {
    title: "Finaca",
    hook: "A lender’s website with loan products, an FAQ and a contact form.",
    description:
      "A financial services site with loan products, an FAQ, contact forms handled in PHP, and a dashboard. Styled with SCSS and responsive.",
    tags: ["HTML", "SCSS", "JavaScript", "PHP"],
    category: "frontend",
    image: "/assets/paintings/painting_5.webp",
    github: "https://github.com/Akash-Kumar-S5/finaca.github.io",
    live: "https://akash-kumar-s5.github.io/finaca.github.io/",
    featured: false,
  },
  {
    title: "Fuel Dispenser RFID App",
    hook: "A Flutter app that starts a fuel dispenser from an RFID card.",
    description:
      "A Flutter app for managing fuel dispensers with RFID. It runs on Android, Windows and the web.",
    tags: ["Flutter", "Dart", "C++", "RFID"],
    category: "fullstack",
    image: "/assets/paintings/painting_6.webp",
    github: "https://github.com/Akash-Kumar-S5/fuel-dispenser-using-RFID-app",
    featured: false,
  },
  {
    title: "GenAI Experiments",
    hook: "Small Python experiments with language models.",
    description:
      "A collection of generative AI experiments in Python. Each one tries out a single idea.",
    tags: ["Python", "AI", "Machine Learning"],
    category: "opensource",
    image: "/assets/paintings/painting_7.webp",
    github: "https://github.com/Akash-Kumar-S5/GenAI",
    featured: false,
  },
];
