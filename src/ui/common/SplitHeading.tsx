import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useOmni } from "../../state/store";

interface SplitHeadingProps {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
}

export default function SplitHeading({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
}: SplitHeadingProps) {
  const reducedMotion = useOmni((s) => s.reducedMotion);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (reducedMotion || !textRef.current) return;

    gsap.registerPlugin(SplitText);
    const split = new SplitText(textRef.current, { type: "chars,words" });

    gsap.from(split.chars, {
      opacity: 0,
      y: 20,
      rotateX: -25,
      stagger: 0.02,
      duration: 0.55,
      delay,
      ease: "power3.out",
    });

    return () => {
      split.revert();
    };
  }, [text, reducedMotion, delay]);

  return (
    <Tag ref={textRef} className={className} aria-label={text}>
      {text}
    </Tag>
  );
}
