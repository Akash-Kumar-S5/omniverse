export interface TechItem {
  name: string;
  category: "language" | "frontend" | "backend" | "tool";
}

export const techStack: TechItem[] = [
  { name: "JavaScript", category: "language" },
  { name: "TypeScript", category: "language" },
  { name: "PHP", category: "language" },
  { name: "SQL", category: "language" },
  { name: "React", category: "frontend" },
  { name: "Next.js", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "Bootstrap", category: "frontend" },
  { name: "HTML/CSS", category: "frontend" },
  { name: "Node.js", category: "backend" },
  { name: "Express.js", category: "backend" },
  { name: "Laravel", category: "backend" },
  { name: "MongoDB", category: "backend" },
  { name: "MySQL", category: "backend" },
  { name: "Git", category: "tool" },
  { name: "GitHub", category: "tool" },
  { name: "REST APIs", category: "tool" },
  { name: "Agile", category: "tool" },
];
