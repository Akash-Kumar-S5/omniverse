import "./textlink.css";

interface TextLinkProps {
  text: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

/** A plain text link. The underline is drawn by CSS (.text-link in styles/index.css). */
export default function TextLink({
  text,
  onClick,
  href,
  target,
  rel,
  className = "",
  ariaLabel,
  disabled = false,
}: TextLinkProps) {
  const cls = `text-link ${className}`.trim();

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={cls} aria-label={ariaLabel}>
        {text}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cls} aria-label={ariaLabel}>
      {text}
    </button>
  );
}
