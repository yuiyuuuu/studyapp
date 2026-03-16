"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./landing.module.css";

type FadeInSectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export function FadeInSection({
  children,
  className,
  id,
}: FadeInSectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || isVisible) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isVisible]);

  const combinedClassName = [
    styles.fadeSection,
    isVisible ? styles.fadeSectionVisible : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={combinedClassName} id={id} ref={ref}>
      {children}
    </section>
  );
}
