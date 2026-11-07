import { useState, useRef, useEffect } from "react";
import "./fallback.css";
import { profile, experiences, education, projects, techStack } from "../../content";

export default function FallbackView() {
  const [copied, setCopied] = useState(false);
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const filteredProjects =
    projectFilter === "all"
      ? projects
      : projects.filter((p) => p.category === projectFilter);

  // Group tech items by category
  const techCategories = [
    { key: "language", title: "Programming Languages" },
    { key: "frontend", title: "Frontend Architecture" },
    { key: "backend", title: "Backend & Databases" },
    { key: "tool", title: "Developer Tools & DevOps" },
  ] as const;

  return (
    <div className="fallback-page">
      <div className="fallback-grid-bg" aria-hidden="true" />

      {/* Navigation Header */}
      <header className="fallback-header">
        <nav className="fallback-nav" aria-label="Main Navigation">
          <a href="#hero" className="fallback-brand">
            <span>{profile.name}</span>
            <span className="fallback-badge">2D View</span>
          </a>
          <ul className="fallback-menu">
            <li><a href="#about" className="fallback-nav-link">About</a></li>
            <li><a href="#experience" className="fallback-nav-link">Experience</a></li>
            <li><a href="#projects" className="fallback-nav-link">Projects</a></li>
            <li><a href="#tech" className="fallback-nav-link">Tech Stack</a></li>
            <li><a href="#contact" className="fallback-nav-link">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="fallback-container">
        {/* Hero Section */}
        <section id="hero" className="fallback-hero" aria-label="Introduction">
          <div className="fallback-eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            <span>{profile.role} • {profile.location}</span>
          </div>
          <h1 className="fallback-title">{profile.name}</h1>
          <p className="fallback-pitch">{profile.pitch}</p>

          <div className="btn-group">
            <a href="#projects" className="btn-primary">
              <span>View Projects</span>
              <span aria-hidden="true">↓</span>
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className={`btn-secondary ${copied ? "copied" : ""}`}
              aria-label={copied ? "Email copied to clipboard" : `Copy email ${profile.email}`}
            >
              <span>{copied ? "✓ Email Copied!" : "✉ Copy Email"}</span>
            </button>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <span>GitHub ↗</span>
            </a>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="fallback-section" aria-label="About and Background">
          <div className="fallback-section-header">
            <div className="fallback-eyebrow">Overview</div>
            <h2 className="fallback-section-title">About Me</h2>
            <p className="fallback-section-subtitle">Core principles, focus areas, and education.</p>
          </div>

          <div className="fallback-grid-2">
            <article className="fallback-card">
              <h3 style={{ margin: "0 0 12px 0", color: "var(--accent)" }}>Autonomous AI & Software Systems</h3>
              <p style={{ color: "var(--fg-dim)", marginBottom: "16px" }}>
                Specialized in architecting developer tooling, AI harness engineering, and robust full-stack platforms.
                Passionate about bringing reliable agentic workflows into production developer environments.
              </p>
              <div className="contact-meta">
                <div><strong>Location:</strong> {profile.location}</div>
                <div><strong>Timezone:</strong> {profile.timezone}</div>
              </div>
            </article>

            <article className="fallback-card">
              <h3 style={{ margin: "0 0 12px 0", color: "var(--accent-2)" }}>Education</h3>
              <p style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 4px 0", color: "var(--fg)" }}>
                {education.institution}
              </p>
              <p style={{ color: "var(--accent)", margin: "0 0 8px 0", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                {education.degree}
              </p>
              <p style={{ color: "var(--fg-dim)", fontFamily: "var(--font-mono)", fontSize: "0.78rem", margin: 0 }}>
                {education.period}
              </p>
            </article>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="fallback-section" aria-label="Career Experience">
          <div className="fallback-section-header">
            <div className="fallback-eyebrow">Career</div>
            <h2 className="fallback-section-title">Work Experience</h2>
            <p className="fallback-section-subtitle">Engineering roles and key production achievements.</p>
          </div>

          <div>
            {experiences.map((exp, idx) => (
              <article key={idx} className="fallback-card fallback-exp-card">
                <div className="fallback-exp-header">
                  <h3 className="fallback-exp-company">{exp.company}</h3>
                  <span className="fallback-exp-period">{exp.period}</span>
                </div>
                <div className="fallback-exp-role">{exp.role}</div>
                <div className="fallback-exp-location">{exp.location}</div>
                <p style={{ color: "var(--fg-dim)", fontSize: "0.92rem", margin: "0 0 12px 0" }}>
                  {exp.description}
                </p>
                <strong style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                  Key Contributions:
                </strong>
                <ul className="achievements-list">
                  {exp.achievements.map((ach, i) => (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="fallback-section" aria-label="Projects Portfolio">
          <div className="fallback-section-header">
            <div className="fallback-eyebrow">Portfolio</div>
            <h2 className="fallback-section-title">Selected Projects</h2>
            <p className="fallback-section-subtitle">Software platforms, developer tools, and AI experiments.</p>
          </div>

          {/* Filter Bar */}
          <div className="fallback-filter-bar" role="tablist" aria-label="Filter projects by category">
            {[
              { id: "all", label: `All (${projects.length})` },
              { id: "fullstack", label: `Full-Stack (${projects.filter(p => p.category === "fullstack").length})` },
              { id: "frontend", label: `Frontend (${projects.filter(p => p.category === "frontend").length})` },
              { id: "opensource", label: `Open Source / AI (${projects.filter(p => p.category === "opensource").length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={projectFilter === tab.id}
                className={`fallback-filter-btn ${projectFilter === tab.id ? "active" : ""}`}
                onClick={() => setProjectFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="fallback-grid-2">
            {filteredProjects.map((proj, idx) => (
              <article key={idx} className="fallback-card fallback-project-card">
                <div className="fallback-project-top">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span className="projects-category-badge">{proj.category}</span>
                    {proj.featured && <span className="featured-badge">★ Featured</span>}
                  </div>
                  <h3 style={{ margin: "0 0 10px 0", fontSize: "1.25rem", color: "var(--fg)" }}>
                    {proj.title}
                  </h3>
                  <p style={{ color: "var(--fg-dim)", fontSize: "0.9rem", lineHeight: 1.5, margin: "0 0 14px 0" }}>
                    {proj.description}
                  </p>
                  <ul className="tags-list" aria-label="Technologies used">
                    {proj.tags.map((tag) => (
                      <li key={tag} className="tag-item">{tag}</li>
                    ))}
                  </ul>
                </div>

                <div className="btn-group">
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      aria-label={`View ${proj.title} source code on GitHub`}
                    >
                      <span>GitHub</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {proj.live && (
                    <a
                      href={proj.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      aria-label={`Open live demo of ${proj.title}`}
                    >
                      <span>Live Demo</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="tech" className="fallback-section" aria-label="Technology and Tools">
          <div className="fallback-section-header">
            <div className="fallback-eyebrow">Skills</div>
            <h2 className="fallback-section-title">Technical Expertise</h2>
            <p className="fallback-section-subtitle">Languages, frameworks, and developer workflows.</p>
          </div>

          <div className="fallback-grid-2">
            {techCategories.map((cat) => {
              const items = techStack.filter((t) => t.category === cat.key);
              return (
                <div key={cat.key} className="fallback-card fallback-tech-group">
                  <h3 className="fallback-tech-title">{cat.title}</h3>
                  <ul className="tags-list" style={{ margin: 0 }}>
                    {items.map((item) => (
                      <li
                        key={item.name}
                        className="tag-item"
                        style={{ fontSize: "0.85rem", padding: "6px 12px" }}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="fallback-section" aria-label="Contact Information">
          <div className="fallback-contact-box">
            <div className="fallback-eyebrow">Get In Touch</div>
            <h2 className="fallback-section-title">Connect with Akash</h2>
            <p style={{ color: "var(--fg-dim)", fontSize: "1rem", lineHeight: 1.6, marginBottom: "24px" }}>
              Interested in collaborating on AI agents, developer tooling, or discussing full-stack engineering
              opportunities? Send a message or connect on LinkedIn and GitHub.
            </p>

            <div className="contact-actions">
              <button
                type="button"
                onClick={handleCopyEmail}
                className={`copy-email-btn ${copied ? "copied" : ""}`}
                aria-label={copied ? "Email copied to clipboard" : `Copy email address ${profile.email}`}
              >
                <span>{copied ? "✓ Copied to clipboard!" : `✉ ${profile.email}`}</span>
                <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>{copied ? "Success" : "Click to copy"}</span>
              </button>
              <div className="sr-only" aria-live="polite">
                {copied ? "Email address copied to clipboard." : ""}
              </div>

              <div className="btn-group">
                <a
                  href={`mailto:${profile.email}`}
                  className="btn-primary"
                  aria-label={`Send direct email to ${profile.email}`}
                >
                  <span>Open Email Client</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  aria-label="GitHub profile"
                >
                  <span>GitHub</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  aria-label="LinkedIn profile"
                >
                  <span>LinkedIn</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <div className="contact-meta" style={{ marginTop: "24px" }}>
              <div><strong>Location:</strong> {profile.location} ({profile.timezone})</div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="fallback-footer">
          <div>
            <span>© {new Date().getFullYear()} {profile.name} • Omniverse Portfolio</span>
          </div>
          <div>
            <a href="#hero" className="fallback-nav-link">Back to top ↑</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
