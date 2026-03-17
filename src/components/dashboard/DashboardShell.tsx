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
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: 1080px)");
    const syncViewportState = () => {
      setIsMobileViewport(mediaQuery.matches);
    };

    syncViewportState();
    mediaQuery.addEventListener("change", syncViewportState);

    return () => {
      mediaQuery.removeEventListener("change", syncViewportState);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    return () => {
      document.documentElement.style.scrollBehavior = "";
      document.body.style.scrollBehavior = "";
    };
  }, [pathname]);

  useEffect(() => {
    const shouldLockMobileScroll =
      isMobileViewport && (isMobileOpen || isChatWidgetOpen);

    if (!shouldLockMobileScroll) {
      return;
    }

    const scrollY = window.scrollY;
    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    const bodyPosition = document.body.style.position;
    const bodyTop = document.body.style.top;
    const bodyLeft = document.body.style.left;
    const bodyRight = document.body.style.right;
    const bodyWidth = document.body.style.width;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
      document.body.style.position = bodyPosition;
      document.body.style.top = bodyTop;
      document.body.style.left = bodyLeft;
      document.body.style.right = bodyRight;
      document.body.style.width = bodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isMobileOpen, isMobileViewport, isChatWidgetOpen]);

  return (
    <div className={styles.shell}>
      <header className={styles.mobileTopbar}>
        <p className={styles.mobileTopbarBrand}>Study App</p>
        <button
          aria-label="Open sidebar"
          className={styles.mobileMenuButton}
          onClick={() => {
            setIsChatWidgetOpen(false);
            setIsMobileOpen(true);
          }}
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

      <div className={styles.chatWidget}>
        {isChatWidgetOpen ? (
          <section
            className={styles.chatWidgetPanel}
            id="dashboard-chat-panel"
            aria-label="Chat panel"
          />
        ) : null}

        <button
          aria-controls="dashboard-chat-panel"
          aria-expanded={isChatWidgetOpen}
          aria-label={isChatWidgetOpen ? "Close chat panel" : "Open chat panel"}
          className={styles.chatWidgetButton}
          onClick={() => {
            const nextOpen = !isChatWidgetOpen;
            if (nextOpen && isMobileViewport && isMobileOpen) {
              setIsMobileOpen(false);
            }
            setIsChatWidgetOpen(nextOpen);
          }}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            {isChatWidgetOpen ? (
              <path d="m6 9 6 6 6-6" />
            ) : (
              <>
                <path d="M5.5 7.5h13v9h-8l-4 3v-3h-1z" />
                <path d="M9 11h6M9 14h4" />
              </>
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}
