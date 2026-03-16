import styles from "./landing.module.css";

type SectionIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "split";
};

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionIntroProps) {
  return (
    <header
      className={
        align === "split" ? styles.sectionIntroSplit : styles.sectionIntro
      }
    >
      <p className={styles.eyebrow}>{eyebrow}</p>
      <div className={styles.sectionCopy}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.sectionDescription}>{description}</p>
      </div>
    </header>
  );
}
