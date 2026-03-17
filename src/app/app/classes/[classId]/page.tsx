"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "@/components/dashboard/dashboard.module.css";

export default function ClassDetailPage() {
  const params = useParams<{ classId: string | string[] }>();
  const classIdParam = params.classId;
  const classId = Array.isArray(classIdParam) ? classIdParam[0] : classIdParam;

  return (
    <div className={styles.pageContent}>
      <header className={styles.pageHeader}>
        <p className={styles.pageEyebrow}>Classes</p>
        <h1 className={styles.pageTitle}>Class {classId}</h1>
        <p className={styles.pageDescription}>
          You are viewing the class detail page for class ID {classId}.
        </p>
      </header>

      <Link className={styles.addClassButton} href='/app/classes'>
        Back to classes
      </Link>
    </div>
  );
}
