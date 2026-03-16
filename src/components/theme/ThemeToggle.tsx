"use client";

import { useTheme } from "./ThemeProvider";
import styles from "./theme-toggle.module.css";

type ThemeToggleProps = {
  className?: string;
  ariaLabel?: string;
};

export function ThemeToggle({ className, ariaLabel }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={[styles.toggle, className ?? ""].filter(Boolean).join(" ")}
      data-theme={theme}
      role="radiogroup"
      aria-label={ariaLabel ?? "Color mode"}
    >
      <span className={styles.thumb} aria-hidden="true" />

      <button
        type="button"
        role="radio"
        aria-label="Light mode"
        aria-checked={theme === "light"}
        className={`${styles.option} ${theme === "light" ? styles.optionActive : ""}`}
        onClick={() => setTheme("light")}
      >
        <svg aria-hidden="true" className={styles.optionIcon} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2.5M12 19v2.5M21.5 12H19M5 12H2.5M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8M18.7 18.7l-1.8-1.8M7.1 7.1 5.3 5.3" />
        </svg>
      </button>

      <button
        type="button"
        role="radio"
        aria-label="Dark mode"
        aria-checked={theme === "dark"}
        className={`${styles.option} ${theme === "dark" ? styles.optionActive : ""}`}
        onClick={() => setTheme("dark")}
      >
        <svg aria-hidden="true" className={styles.optionIcon} viewBox="0 0 24 24">
          <path d="M20 14.1A8 8 0 1 1 9.9 4a6.3 6.3 0 1 0 10.1 10.1Z" />
        </svg>
      </button>
    </div>
  );
}
