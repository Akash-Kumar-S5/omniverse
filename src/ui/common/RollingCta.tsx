import { useOmni } from "../../state/store";
import "./rolling.css";

interface RollingCtaProps {
  text: string;
  icon?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  ariaLabel?: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export default function RollingCta({
  text,
  icon,
  onClick,
  href,
  target,
  rel,
  className = "",
  ariaLabel,
  variant = "primary",
  disabled = false,
}: RollingCtaProps) {
  const reducedMotion = useOmni((s) => s.reducedMotion);
  const fullLabel = ariaLabel || text;

  const content = (
    <>
      <span className="rolling-track" aria-hidden="true">
        {text.split("").map((ch, idx) => (
          <span
            key={idx}
            className="roll-char"
            style={{ "--char-i": idx } as React.CSSProperties}
          >
            <span className="roll-char-primary">{ch === " " ? "\u00A0" : ch}</span>
            <span className="roll-char-secondary">{ch === " " ? "\u00A0" : ch}</span>
          </span>
        ))}
      </span>
      {icon && <span className="rolling-icon" aria-hidden="true">{icon}</span>}
    </>
  );

  const baseClass = `rolling-cta ${variant === "primary" ? "cta-primary" : "cta-secondary"} ${className} ${reducedMotion ? "no-roll" : ""}`;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={baseClass}
        aria-label={fullLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={baseClass}
      aria-label={fullLabel}
    >
      {content}
    </button>
  );
}
