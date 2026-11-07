import { useState, useRef, useEffect } from "react";
import { profile } from "../../content";
import SplitHeading from "../common/SplitHeading";
import RollingCta from "../common/RollingCta";

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
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <div
      className="chapter-view chapter-contact"
      aria-label="Contact and Terminal"
    >
      <div className="contact-editorial-layout">
        <div className="section-eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          <span>04 // CONVERGENCE</span>
        </div>

        <SplitHeading
          text="Let's Build Together"
          as="h2"
          className="contact-title"
        />

        <p className="contact-subtitle">AI Agent Systems • Developer Tools</p>
        <p className="contact-desc">
          Open to software engineering roles, agentic AI architecture projects, and developer tooling collaborations.
          Reach out directly to connect.
        </p>

        <div className="contact-action-group">
          <button
            type="button"
            onClick={handleCopyEmail}
            className={`contact-copy-pill ${copied ? "copied" : ""}`}
            aria-label={copied ? "Email copied to clipboard" : `Copy email address ${profile.email}`}
          >
            <span className="copy-label">{copied ? "✓ Copied to clipboard" : `✉ ${profile.email}`}</span>
            <span className="copy-hint">{copied ? "Copied" : "Click to copy"}</span>
          </button>

          <div className="contact-links-row">
            <RollingCta
              href={`mailto:${profile.email}`}
              text="Direct Email"
              icon="↗"
              variant="primary"
              ariaLabel={`Send direct email to ${profile.email}`}
            />
            <RollingCta
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              text="GitHub"
              icon="↗"
              variant="secondary"
              ariaLabel="Akash Kumar's GitHub profile"
            />
            <RollingCta
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              text="LinkedIn"
              icon="↗"
              variant="secondary"
              ariaLabel="Akash Kumar's LinkedIn profile"
            />
          </div>
        </div>

        <div className="contact-meta-info">
          <div>
            <strong style={{ color: "var(--fg)" }}>LOCATION:</strong> {profile.location} ({profile.timezone})
          </div>
          <div>
            <strong style={{ color: "var(--fg)" }}>AVAILABILITY:</strong> Open to Senior / Staff engineering roles
          </div>
        </div>
      </div>
    </div>
  );
}
