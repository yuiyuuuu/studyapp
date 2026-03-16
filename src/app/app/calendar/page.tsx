import styles from "@/components/dashboard/dashboard.module.css";
import { InteractiveCalendar } from "@/components/dashboard/InteractiveCalendar";

const schedule = [
  {
    title: "Monday / Recall sprint",
    meta: "7:00 PM - 7:45 PM",
    body: "Organic chemistry mechanism review with flash prompts and a short self-test.",
  },
  {
    title: "Wednesday / Reading block",
    meta: "6:30 PM - 7:30 PM",
    body: "Cell biology chapter split into two sections with one checkpoint summary.",
  },
  {
    title: "Saturday / Mock exam",
    meta: "10:00 AM - 12:00 PM",
    body: "Timed mixed-subject run to test pacing before the next assessment window.",
  },
];

export default function CalendarPage() {
  return (
    <div className={styles.pageContent}>
      <header className={styles.pageHeader}>
        <p className={styles.pageEyebrow}>Calendar</p>
        <h1 className={styles.pageTitle}>Place study sessions where they can hold.</h1>
        <p className={styles.pageDescription}>
          Your calendar is where class content becomes a real review rhythm,
          with blocks for reading, retrieval, and full exam rehearsal.
        </p>
      </header>

      <section className={styles.listCard}>
        <p className={styles.cardLabel}>This week</p>
        <h2 className={styles.cardTitle}>Upcoming sessions</h2>
        <div className={styles.list}>
          {schedule.map((item) => (
            <div className={styles.listItem} key={item.title}>
              <p className={styles.listTitle}>{item.title}</p>
              <p className={styles.listMeta}>{item.meta}</p>
              <p className={styles.listBody}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.listCard}>
        <p className={styles.cardLabel}>Monthly view</p>
        <h2 className={styles.cardTitle}>Plan by date</h2>
        <InteractiveCalendar />
      </section>
    </div>
  );
}
