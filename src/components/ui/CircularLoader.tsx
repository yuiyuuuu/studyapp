import type { CSSProperties } from "react";
import styles from "./circular-loader.module.css";

type CircularLoaderProps = {
  className?: string;
  label?: string;
  size?: number;
};

export function CircularLoader({
  className = "",
  label = "Loading",
  size = 44,
}: CircularLoaderProps) {
  return (
    <div
      aria-label={label}
      aria-live="polite"
      className={`${styles.loaderWrap} ${className}`.trim()}
      role="status"
    >
      <span
        aria-hidden="true"
        className={styles.loaderCircle}
        style={{ "--loader-size": `${size}px` } as CSSProperties}
      />
      <span className={styles.srOnly}>{label}</span>
    </div>
  );
}
