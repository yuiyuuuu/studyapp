import Link from "next/link";
import styles from "@/components/dashboard/dashboard.module.css";

export default function ContactPage() {
  return (
    <main className={styles.contactPage}>
      <div className={styles.contactCard}>
        <p className={styles.pageEyebrow}>Support</p>
        <h1 className={styles.contactTitle}>Need technical help?</h1>
        <p className={styles.contactText}>
          Reach out to the Study App support team and include the class, upload
          type, and device you were using when the issue happened.
        </p>
        <p className={styles.contactText}>
          Email: support@studyapp.example
        </p>
        <Link className={styles.contactLink} href="/app">
          Return to dashboard
        </Link>
      </div>
    </main>
  );
}
