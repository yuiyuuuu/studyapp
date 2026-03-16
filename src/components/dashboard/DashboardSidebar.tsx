"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import styles from "./dashboard.module.css";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

type DashboardSidebarProps = {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
};

const navItems: NavItem[] = [
  {
    href: "/app",
    label: "Overview",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4 5.5h16M4 12h16M4 18.5h16" />
      </svg>
    ),
  },
  {
    href: "/app/classes",
    label: "Classes",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4 7h16v10H4z" />
        <path d="M8 11h8M8 15h5" />
      </svg>
    ),
  },
  {
    href: "/mockexams",
    label: "Mock Exams",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6 4.5h12v15H6z" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    href: "/app/calendar",
    label: "Calendar",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M5 6.5h14v12H5z" />
        <path d="M8 4v5M16 4v5M5 10h14" />
      </svg>
    ),
  },
  {
    href: "/app/chat",
    label: "ChatGPT",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6 7.5h12v9H9l-3 3z" />
        <path d="M9 11h6M9 14h4" />
      </svg>
    ),
  },
];

export function DashboardSidebar({
  isCollapsed,
  isMobileOpen,
  onCloseMobile,
  onToggleCollapse,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!profileRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function handleToggleCollapse() {
    setIsProfileMenuOpen(false);
    onToggleCollapse();
  }

  function handleNavigate() {
    setIsProfileMenuOpen(false);
    onCloseMobile();
  }

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ""} ${isMobileOpen ? styles.sidebarMobileOpen : ""}`}
    >
      <button
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={styles.sidebarToggle}
        onClick={handleToggleCollapse}
        type="button"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          {isCollapsed ? (
            <>
              <path d="m8 7 5 5-5 5" />
              <path d="m12 7 5 5-5 5" />
            </>
          ) : (
            <>
              <path d="m16 7-5 5 5 5" />
              <path d="m12 7-5 5 5 5" />
            </>
          )}
        </svg>
      </button>
      <button
        aria-label="Close sidebar"
        className={styles.mobileCloseButton}
        onClick={onCloseMobile}
        type="button"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
      <div className={styles.sidebarInner}>
        <div className={styles.sidebarHeader}>
          <Link className={styles.sidebarBrand} href="/app" onClick={handleNavigate}>
            Study App
          </Link>
        </div>

        <nav className={styles.sidebarNav} aria-label="Dashboard navigation">
          {navItems.map((item) => {
            const isActive =
              item.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                className={isActive ? styles.sidebarLinkActive : styles.sidebarLink}
                href={item.href}
                onClick={handleNavigate}
              >
                <span className={styles.sidebarIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <ThemeToggle
            className={styles.sidebarThemeToggle}
            ariaLabel="Dashboard theme"
          />
          <div className={styles.profileWrap} ref={profileRef}>
            {isProfileMenuOpen ? (
              <div className={styles.profileMenu} role="menu" aria-label="Profile menu">
                <Link
                  className={styles.profileMenuAction}
                  href="/app"
                  onClick={handleNavigate}
                >
                  Manage subscription
                </Link>
                <Link
                  className={styles.profileMenuAction}
                  href="/contact"
                  onClick={handleNavigate}
                >
                  Contact us
                </Link>
                <Link
                  className={styles.profileMenuAction}
                  href="/"
                  onClick={handleNavigate}
                >
                  Sign out
                </Link>
              </div>
            ) : null}

            <button
              className={styles.profileButton}
              onClick={() => setIsProfileMenuOpen((current) => !current)}
              type="button"
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="menu"
            >
              <span className={styles.profileAvatar} aria-hidden="true">
                TA
              </span>
              <span className={styles.profileCopy}>
                <span className={styles.profileName}>Tanyu A.</span>
                <span className={styles.profilePlan}>Free</span>
              </span>
              <span className={styles.profileChevron} aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="m6 15 6-6 6 6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
