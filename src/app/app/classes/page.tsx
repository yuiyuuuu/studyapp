import styles from "@/components/dashboard/dashboard.module.css";

const classCards = [
  {
    label: "MCAT / Biology",
    title: "Cellular respiration",
    text: "Three textbook excerpts, one slide deck, and a short lecture recording waiting to be summarized.",
  },
  {
    label: "History 210",
    title: "Industrial Revolution",
    text: "Annotated reading plus professor notes ready for a comparison-style review session.",
  },
  {
    label: "Calculus III",
    title: "Vector fields",
    text: "Problem sets and worked examples grouped into one practice lane before next week’s quiz.",
  },
];

export default function ClassesPage() {
  return (
    <div className={styles.pageContent}>
      <header className={styles.pageHeader}>
        <p className={styles.pageEyebrow}>Classes</p>
        <h1 className={styles.pageTitle}>Organize every exam by subject.</h1>
        <p className={styles.pageDescription}>
          Each class becomes a home for uploads, review sets, and progress
          tracking so your study flow stays attached to the course it belongs to.
        </p>
      </header>

      <section className={styles.gridThree}>
        {classCards.map((card) => (
          <article className={styles.card} key={card.title}>
            <p className={styles.cardLabel}>{card.label}</p>
            <h2 className={styles.cardTitle}>{card.title}</h2>
            <p className={styles.cardText}>{card.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
