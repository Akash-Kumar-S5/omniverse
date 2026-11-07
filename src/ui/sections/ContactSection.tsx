import { useState, useRef, useEffect } from "react";
import { profile, copy } from "../../content";
import SplitHeading from "../common/SplitHeading";
import TextLink from "../common/TextLink";

export default function ContactSection() {
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
    <div className="chapter-view chapter-contact" aria-label="Contact">
      <SplitHeading text={copy.contact.title} as="h2" className="contact-title" />

      <p className="contact-desc">{copy.contact.pitch}</p>

      <a className="contact-email" href={`mailto:${profile.email}`}>
        {profile.email}
      </a>

      <div className="contact-links-row">
        <TextLink
          text={copied ? copy.contact.copiedEmail : copy.contact.copyEmail}
          onClick={handleCopyEmail}
          ariaLabel={copied ? "Email address copied" : `Copy ${profile.email}`}
        />
        <TextLink
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          text="GitHub"
          ariaLabel="Akash Kumar on GitHub"
        />
        <TextLink
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          text="LinkedIn"
          ariaLabel="Akash Kumar on LinkedIn"
        />
      </div>
    </div>
  );
}
