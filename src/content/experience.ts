export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
}

export const experiences: Experience[] = [
  {
    company: "Presidio",
    role: "Engineer",
    period: "Sep 2025 - Present",
    location: "Chennai, Tamil Nadu, India",
    description:
      "Building and maintaining scalable web applications, collaborating with cross-functional teams to deliver end-to-end solutions.",
    achievements: [
      "Developing full stack features using modern JavaScript frameworks",
      "Designing and implementing RESTful APIs for seamless front-to-back communication",
      "Collaborating in Agile sprints to ship production-ready features",
    ],
  },
  {
    company: "Presidio",
    role: "Associate Engineer",
    period: "Sep 2024 - Sep 2025",
    location: "Chennai, Tamil Nadu, India",
    description:
      "Contributed to enterprise-grade applications with a focus on front-end development and API integration.",
    achievements: [
      "Built responsive UIs with React and Tailwind CSS for internal tools",
      "Integrated third-party APIs and optimized data fetching workflows",
      "Participated in code reviews and improved code quality standards",
    ],
  },
  {
    company: "Presidio",
    role: "Intern",
    period: "Jul 2024 - Sep 2024",
    location: "Chennai, Tamil Nadu, India",
    description:
      "Completed intensive training and contributed to live projects during the internship program.",
    achievements: [
      "Gained hands-on experience with the MERN stack in a production environment",
      "Built reusable components and contributed to the component library",
      "Learned enterprise development workflows including Git, CI/CD, and Agile",
    ],
  },
  {
    company: "Mallow Technologies",
    role: "Intern Full-stack Developer",
    period: "Jun 2023 - Oct 2023",
    location: "Karur, Tamil Nadu, India",
    description:
      "Worked on full-stack web development projects using PHP (Laravel) and JavaScript.",
    achievements: [
      "Developed features using Laravel for back-end and Bootstrap for front-end",
      "Managed SQL and NoSQL databases for multiple project modules",
      "Delivered end-to-end features from database design to UI implementation",
    ],
  },
];

export const education = {
  institution: "Karpagam College of Engineering",
  degree: "Bachelor of Technology - BTech, Information Technology",
  period: "Oct 2020 - May 2024",
};
