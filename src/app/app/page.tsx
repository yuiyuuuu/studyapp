import styles from "@/components/dashboard/dashboard.module.css";

const metrics = [
  {
    value: "06",
    label: "Active classes",
    text: "Biology, chemistry, calculus, and the rest of this week’s exam stack.",
  },
  {
    value: "18",
    label: "Items due",
    text: "A mix of flash review blocks, reading checkpoints, and practice sets.",
  },
  {
    value: "04",
    label: "Uploads today",
    text: "New PDFs, a lecture deck, and one recorded review session ready to sort.",
  },
  {
    value: "82%",
    label: "Recall trend",
    text: "Your last three sessions are holding steady above the target confidence line.",
  },
];

const classes = [
  {
    title: "Organic Chemistry II",
    meta: "12 assets / next exam in 9 days",
    body: "Lecture slides, lab notes, and a reaction map are already split into review blocks.",
  },
  {
    title: "Cell Biology",
    meta: "8 assets / quiz on Thursday",
    body: "A dense chapter summary needs one more pass and a short recall drill.",
  },
  {
    title: "Applied Statistics",
    meta: "5 assets / problem set due Friday",
    body: "You’re strongest on distributions and weakest on hypothesis testing proofs.",
  },
];

const uploads = [
  {
    title: "Textbooks and chapter scans",
    meta: "PDF / EPUB / image scan",
    body: "Break long reading into sections, then surface key concepts for later review.",
  },
  {
    title: "Lecture slides and notes",
    meta: "PPT / KEY / PDF / docs",
    body: "Turn broad decks into class-specific prompts and session outlines.",
  },
  {
    title: "Videos and recordings",
    meta: "MP4 / lecture capture / screen recording",
    body: "Attach context to the exact class so explanations stay tied to the right material.",
  },
];

export default function AppOverviewPage() {
  return (
    <div className={styles.pageContent}>
      <header className={styles.pageHeader}>
        <p className={styles.pageEyebrow}>Overview</p>
        <h1 className={styles.pageTitle}>Your study system, class by class.</h1>
        <p className={styles.pageDescription}>
          This dashboard is where exam prep becomes structured. Every class
          holds its own PDFs, slides, video recordings, textbooks, and notes so
          you can study by subject instead of hunting across folders.
        </p>
      </header>

      <section className={`${styles.heroPanel} ${styles.heroPanelFocus}`}>
        <div className={styles.heroMeta}>
          <p className={styles.heroMetaLabel}>Today&apos;s focus</p>
          <p className={styles.heroMetaValue}>
            Upload new material into each class, then turn it into timed review
            blocks before the week gets noisy.
          </p>
        </div>
      </section>

      <section className={styles.gridFour}>
        {metrics.map((metric) => (
          <article className={styles.metricCard} key={metric.label}>
            <p className={styles.metricValue}>{metric.value}</p>
            <p className={styles.metricLabel}>{metric.label}</p>
            <p className={styles.metricText}>{metric.text}</p>
          </article>
        ))}
      </section>

      <section className={styles.gridTwo}>
        <article className={styles.listCard}>
          <p className={styles.cardLabel}>Classes</p>
          <h2 className={styles.cardTitle}>Where your content lives</h2>
          <div className={styles.list}>
            {classes.map((item) => (
              <div className={styles.listItem} key={item.title}>
                <p className={styles.listTitle}>{item.title}</p>
                <p className={styles.listMeta}>{item.meta}</p>
                <p className={styles.listBody}>{item.body}</p>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.listCard}>
          <p className={styles.cardLabel}>Accepted content</p>
          <h2 className={styles.cardTitle}>Upload the raw material once</h2>
          <div className={styles.list}>
            {uploads.map((item) => (
              <div className={styles.listItem} key={item.title}>
                <p className={styles.listTitle}>{item.title}</p>
                <p className={styles.listMeta}>{item.meta}</p>
                <p className={styles.listBody}>{item.body}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
