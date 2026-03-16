import { DashboardShell } from "@/components/dashboard/DashboardShell";
import styles from "@/components/dashboard/dashboard.module.css";

const exams = [
  {
    title: "Biology / Full-length Mock",
    meta: "Saturday, 10:00 AM - 12:00 PM",
    body: "Timed section run with post-exam review prompts and confidence scoring.",
  },
  {
    title: "Chemistry / Short Mock",
    meta: "Tuesday, 6:30 PM - 7:30 PM",
    body: "Focused set on weak units before final weekly revision blocks.",
  },
  {
    title: "Mixed Subjects / Sprint",
    meta: "Thursday, 7:00 PM - 8:00 PM",
    body: "Rapid mixed-topic test designed to pressure pacing and retrieval under time.",
  },
];

export default function MockExamsPage() {
  return (
    <DashboardShell>
      <div className={styles.pageContent}>
        <header className={styles.pageHeader}>
          <p className={styles.pageEyebrow}>Mock Exams</p>
          <h1 className={styles.pageTitle}>Train with timed simulations.</h1>
          <p className={styles.pageDescription}>
            Build exam readiness with full-length and focused mock sessions,
            then review each run to tighten weak spots before test day.
          </p>
        </header>

        <section className={styles.listCard}>
          <p className={styles.cardLabel}>Upcoming</p>
          <h2 className={styles.cardTitle}>Scheduled mocks</h2>
          <div className={styles.list}>
            {exams.map((exam) => (
              <div className={styles.listItem} key={exam.title}>
                <p className={styles.listTitle}>{exam.title}</p>
                <p className={styles.listMeta}>{exam.meta}</p>
                <p className={styles.listBody}>{exam.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
