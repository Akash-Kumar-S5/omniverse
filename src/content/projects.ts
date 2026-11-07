export interface Project {
  title: string;
  description: string;
  tags: string[];
  category: "frontend" | "backend" | "fullstack" | "opensource";
  image?: string;
  github?: string;
  live?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: "SalarySync",
    description:
      "A Laravel-based payroll management system with role-based access. Admins can create employee records, assign and process salaries. Employees view payment history and personal details.",
    tags: ["Laravel", "PHP", "Blade", "Tailwind CSS", "Vite"],
    category: "fullstack",
    github: "https://github.com/Akash-Kumar-S5/SalarySync",
    featured: true,
  },
  {
    title: "Rentify",
    description:
      "A full-stack rental platform with a client-server architecture. Built with JavaScript featuring a dedicated frontend client and backend server for managing rental listings.",
    tags: ["JavaScript", "Node.js", "HTML", "CSS"],
    category: "fullstack",
    github: "https://github.com/Akash-Kumar-S5/Rentify",
    featured: true,
  },
  {
    title: "Website Performance Monitor",
    description:
      "A full-stack tool for monitoring website performance metrics. Features a separate frontend dashboard and backend service for tracking and analyzing site performance data.",
    tags: ["JavaScript", "Node.js", "CSS"],
    category: "fullstack",
    github: "https://github.com/Akash-Kumar-S5/website-performance-monitor",
    featured: true,
  },
  {
    title: "Innovation Sprint 2025",
    description:
      "A sprint-based innovation project at Presidio organized across 5 weeks, including a research agent built with Python. Combines Python and JavaScript for AI-driven tooling.",
    tags: ["Python", "JavaScript", "AI", "Research"],
    category: "opensource",
    github: "https://github.com/Akash-Kumar-S5/Innovation-sprint-2025",
    featured: false,
  },
  {
    title: "MediHub",
    description:
      "A healthcare services web application with user authentication, contact forms, and a clean UI for medical service information and patient interaction.",
    tags: ["HTML", "CSS", "JavaScript"],
    category: "frontend",
    github: "https://github.com/Akash-Kumar-S5/MediHub.github.io",
    live: "https://akash-kumar-s5.github.io/MediHub.github.io/",
    featured: false,
  },
  {
    title: "Finaca",
    description:
      "A financial services website featuring loan products, FAQ, contact forms with PHP processing, and a dashboard. Built with SCSS and responsive design.",
    tags: ["HTML", "SCSS", "JavaScript", "PHP"],
    category: "frontend",
    github: "https://github.com/Akash-Kumar-S5/finaca.github.io",
    live: "https://akash-kumar-s5.github.io/finaca.github.io/",
    featured: false,
  },
  {
    title: "Fuel Dispenser RFID App",
    description:
      "A cross-platform Flutter mobile app for managing fuel dispensers using RFID technology. Supports Android, Windows, and web platforms.",
    tags: ["Flutter", "Dart", "C++", "RFID"],
    category: "fullstack",
    github: "https://github.com/Akash-Kumar-S5/fuel-dispenser-using-RFID-app",
    featured: false,
  },
  {
    title: "GenAI Experiments",
    description:
      "A collection of generative AI experiments and explorations built with Python, covering various AI/ML concepts and implementations.",
    tags: ["Python", "AI", "Machine Learning"],
    category: "opensource",
    github: "https://github.com/Akash-Kumar-S5/GenAI",
    featured: false,
  },
];
