import Link from "next/link";
import styles from "./landing.module.css";

type TextActionProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export function TextAction({
  href,
  children,
  variant = "primary",
}: TextActionProps) {
  const className =
    variant === "secondary"
      ? styles.secondaryAction
      : variant === "ghost"
        ? styles.ghostAction
        : styles.primaryAction;

  return (
    <Link className={className} href={href}>
      <span>{children}</span>
      <span aria-hidden='true' className={styles.actionArrow}></span>
    </Link>
  );
}
