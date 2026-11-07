import { useState, useRef, useEffect } from "react";
import "./fallback.css";
import { profile, copy, experiences, education, projects, techStack } from "../../content";

const techGroups = [
  { key: "language", title: "Languages" },
  { key: "frontend", title: "Front end" },
  { key: "backend", title: "Back end and data" },
  { key: "tool", title: "Tools and process" },
] as const;

export default function FallbackView() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <div className="fb">
      <header className="fb-header">
        <nav className="fb-nav" aria-label="Sections">
          <a href="#top" className="fb-name">{profile.name}</a>
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#work">Work</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="fb-main" id="top">
        <section className="fb-hero" aria-label="Introduction">
          <h1>{profile.name}</h1>
          <p className="fb-lead">{copy.hero.tagline}</p>
          <a className="text-link" href="#projects">{copy.hero.cta}</a>
        </section>

        <section id="about" className="fb-section" aria-labelledby="about-h">
          <h2 id="about-h">{copy.about.title}</h2>
          <div className="fb-body">
            <p>{copy.about.lead}</p>
            <dl className="fb-facts">
              <div><dt>Based in</dt><dd>{profile.location}</dd></div>
              <div><dt>Studied</dt><dd>{education.institution}, {education.degree} (<time>{education.period}</time>)</dd></div>
            </dl>
          </div>
        </section>

        <section id="work" className="fb-section" aria-labelledby="work-h">
          <h2 id="work-h">{copy.experience.title}</h2>
          <ol className="fb-list">
            {experiences.map((exp) => (
              <li key={exp.period}>
                <p className="fb-meta">{exp.period}</p>
                <div>
                  <h3>{exp.role}, <em>{exp.company}</em></h3>
                  <p>{exp.description}</p>
                  <ul className="fb-dash">
                    {exp.achievements.map((a) => <li key={a}>{a}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="projects" className="fb-section" aria-labelledby="projects-h">
          <h2 id="projects-h">{copy.projects.title}</h2>
          <ol className="fb-list">
            {projects.map((p) => (
              <li key={p.title}>
                <p className="fb-meta">{p.tags.join(", ")}</p>
                <div>
                  <h3>{p.title}</h3>
                  {p.hook && <p className="fb-hook">{p.hook}</p>}
                  <p>{p.description}</p>
                  <p className="fb-links">
                    {p.live && <a className="text-link" href={p.live} target="_blank" rel="noopener noreferrer">Open the site</a>}
                    {p.github && <a className="text-link" href={p.github} target="_blank" rel="noopener noreferrer">Read the code</a>}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="fb-section" aria-labelledby="tools-h">
          <h2 id="tools-h">What I use</h2>
          <dl className="fb-facts fb-tools">
            {techGroups.map((g) => (
              <div key={g.key}>
                <dt>{g.title}</dt>
                <dd>{techStack.filter((t) => t.category === g.key).map((t) => t.name).join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="contact" className="fb-section fb-contact" aria-labelledby="contact-h">
          <h2 id="contact-h">{copy.contact.title}</h2>
          <div className="fb-body">
            <p>{copy.contact.pitch}</p>
            <a className="fb-email" href={`mailto:${profile.email}`}>{profile.email}</a>
            <p className="fb-links">
              <button type="button" className="text-link" onClick={handleCopyEmail}>
                {copied ? copy.contact.copiedEmail : copy.contact.copyEmail}
              </button>
              <a className="text-link" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a className="text-link" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </p>
            <div className="sr-only" aria-live="polite">{copied ? "Email address copied." : ""}</div>
          </div>
        </section>
      </main>

      <footer className="fb-footer">
        <span>{profile.name}, {profile.location}</span>
        <a className="text-link" href="#top">Back to top</a>
      </footer>
    </div>
  );
}
