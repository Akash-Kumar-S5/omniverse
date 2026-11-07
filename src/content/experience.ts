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
    period: "Sep 2025 – Present",
    location: "Chennai",
    description:
      "I build and maintain web applications, working with the people who design and test them so a feature ships end to end.",
    achievements: [
      "Design and write the REST APIs behind production features",
      "Ship in two-week sprints with the rest of the team",
    ],
  },
  {
    company: "Presidio",
    role: "Associate Engineer",
    period: "Sep 2024 – Sep 2025",
    location: "Chennai",
    description:
      "I worked on enterprise applications, mostly the front end and the API calls behind it.",
    achievements: [
      "Built internal tool interfaces in React and Tailwind CSS",
      "Wired up third-party APIs and made data fetching faster",
    ],
  },
  {
    company: "Presidio",
    role: "Intern",
    period: "Jul 2024 – Sep 2024",
    location: "Chennai",
    description:
      "Training first, then live projects as part of the internship program.",
    achievements: [
      "Wrote reusable components for an enterprise UI library",
      "Shipped features on the MERN stack through the company’s CI/CD pipeline",
    ],
  },
  {
    company: "Mallow Technologies",
    role: "Intern, full-stack developer",
    period: "Jun 2023 – Oct 2023",
    location: "Karur",
    description:
      "Full-stack web work in PHP (Laravel) and JavaScript.",
    achievements: [
      "Built web modules with Laravel and Bootstrap",
      "Designed relational and NoSQL schemas for features that went live",
    ],
  },
];

export const education = {
  institution: "Karpagam College of Engineering",
  degree: "B.Tech, Information Technology",
  period: "Oct 2020 – May 2024",
};
