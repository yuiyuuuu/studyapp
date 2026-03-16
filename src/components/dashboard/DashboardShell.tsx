"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import { DashboardSidebar } from "./DashboardSidebar";

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    return () => {
      document.documentElement.style.scrollBehavior = "";
      document.body.style.scrollBehavior = "";
    };
  }, [pathname]);

  return (
    <div className={styles.shell}>
      <header className={styles.mobileTopbar}>
        <p className={styles.mobileTopbarBrand}>Study App</p>
        <button
          aria-label="Open sidebar"
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileOpen(true)}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </header>
      <DashboardSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        onToggleCollapse={() => setIsCollapsed((current) => !current)}
      />
      <main
        className={`${styles.main} ${isCollapsed ? styles.mainCollapsed : ""}`}
      >
        {children}
      </main>
    </div>
  );
}
