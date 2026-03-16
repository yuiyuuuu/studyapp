import styles from "@/components/dashboard/dashboard.module.css";

const prompts = [
  {
    title: "Summarize a lecture deck",
    meta: "Slides to study notes",
    body: "Turn uploaded slides into a compact explanation before building recall prompts.",
  },
  {
    title: "Generate exam questions",
    meta: "Practice from source material",
    body: "Ask for multiple-choice, short answer, or oral quiz questions from a class folder.",
  },
  {
    title: "Explain a weak topic",
    meta: "Target confusion directly",
    body: "Use your class assets as context so explanations stay grounded in your own material.",
  },
];

export default function ChatPage() {
  return (
    <div className={styles.pageContent}>
      <header className={styles.pageHeader}>
        <p className={styles.pageEyebrow}>ChatGPT</p>
        <h1 className={styles.pageTitle}>Ask for help without losing the class context.</h1>
        <p className={styles.pageDescription}>
          The chat workspace is for turning your uploaded material into clearer
          notes, tougher questions, and faster explanations when a concept
          refuses to settle.
        </p>
      </header>

      <section className={styles.gridThree}>
        {prompts.map((prompt) => (
          <article className={styles.card} key={prompt.title}>
            <p className={styles.cardLabel}>{prompt.meta}</p>
            <h2 className={styles.cardTitle}>{prompt.title}</h2>
            <p className={styles.cardText}>{prompt.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
