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
      "Designing and implementing RESTful APIs for production full-stack features",
      "Collaborating in Agile sprints to ship production-ready web application features",
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
      "Built responsive internal tool interfaces with React and Tailwind CSS",
      "Integrated third-party APIs and optimized data fetching workflows",
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
      "Developed reusable components for enterprise UI component libraries",
      "Built production features with the MERN stack in enterprise CI/CD workflows",
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
      "Developed full-stack web modules using Laravel and Bootstrap",
      "Designed and managed relational and NoSQL database schemas for live project features",
    ],
  },
];

export const education = {
  institution: "Karpagam College of Engineering",
  degree: "Bachelor of Technology - BTech, Information Technology",
  period: "Oct 2020 - May 2024",
};
