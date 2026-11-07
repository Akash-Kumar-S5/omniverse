import { useState, useRef, useEffect } from "react";
import { profile } from "../../content";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      // Fallback if clipboard API is restricted
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section
      data-section="contact"
      className="section-container section-contact"
      aria-label="Contact and Beacon Terminal"
    >
      <div className="section-panel">
        <div className="sheet-handle" aria-hidden="true" />

        <div className="section-eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          <span>Final Waypoint // Beacon Terminal</span>
        </div>

        <h2 className="section-title">Let&apos;s Build Together</h2>
        <p className="section-subtitle">AI Agent Systems • Full-Stack Software</p>
        <p className="section-description">
          Open to software engineering roles, agentic AI architecture projects, and developer tooling collaborations.
          Reach out directly to connect.
        </p>

        {/* Contact actions */}
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
              aria-label={`Send email directly to ${profile.email}`}
            >
              <span>Send Direct Email</span>
              <span aria-hidden="true">↗</span>
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              aria-label="Akash Kumar's GitHub profile"
            >
              <span>GitHub</span>
              <span aria-hidden="true">↗</span>
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              aria-label="Akash Kumar's LinkedIn profile"
            >
              <span>LinkedIn</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="contact-meta">
          <div>
            <strong style={{ color: "var(--fg)" }}>Based in:</strong> {profile.location} ({profile.timezone})
          </div>
          <div>
            <strong style={{ color: "var(--fg)" }}>Status:</strong> Beacon converged • Available for work
          </div>
        </div>
      </div>
    </section>
  );
}
