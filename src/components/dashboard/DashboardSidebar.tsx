"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { CircularLoader } from "@/components/ui/CircularLoader";
import styles from "./dashboard.module.css";

const CLASSES_STORAGE_KEY = "studyapp-classes";
const CHAPTER_PLACEHOLDERS = [
  "Introduction and Foundations",
  "Javascript and React",
  "Backend and Python",
];

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

type SidebarClass = {
  id: number;
  className: string;
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
      <svg aria-hidden='true' viewBox='0 0 24 24'>
        <path d='M4 5.5h16M4 12h16M4 18.5h16' />
      </svg>
    ),
  },
  {
    href: "/app/classes",
    label: "Classes",
    icon: (
      <svg aria-hidden='true' viewBox='0 0 24 24'>
        <path d='M4 7h16v10H4z' />
        <path d='M8 11h8M8 15h5' />
      </svg>
    ),
  },
  {
    href: "/mockexams",
    label: "Mock Exams",
    icon: (
      <svg aria-hidden='true' viewBox='0 0 24 24'>
        <path d='M6 4.5h12v15H6z' />
        <path d='M9 8h6M9 12h6M9 16h4' />
      </svg>
    ),
  },
  {
    href: "/app/calendar",
    label: "Calendar",
    icon: (
      <svg aria-hidden='true' viewBox='0 0 24 24'>
        <path d='M5 6.5h14v12H5z' />
        <path d='M8 4v5M16 4v5M5 10h14' />
      </svg>
    ),
  },
];

function parseSidebarClasses(rawValue: string | null): SidebarClass[] {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (entry): entry is SidebarClass =>
          Boolean(entry) &&
          typeof entry === "object" &&
          typeof (entry as SidebarClass).id === "number" &&
          typeof (entry as SidebarClass).className === "string",
      )
      .map((entry) => ({ id: entry.id, className: entry.className }))
      .sort((a, b) => a.id - b.id);
  } catch {
    return [];
  }
}

export function DashboardSidebar({
  isCollapsed,
  isMobileOpen,
  onCloseMobile,
  onToggleCollapse,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [sidebarClasses, setSidebarClasses] = useState<SidebarClass[]>([]);
  const [isSidebarClassesReady, setIsSidebarClassesReady] = useState(false);
  const [expandedClassIds, setExpandedClassIds] = useState<number[]>([]);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const isClassesRoute = pathname.startsWith("/app/classes");
  const shouldShowClassesSubsection =
    isClassesRoute &&
    (!isSidebarClassesReady || sidebarClasses.length > 0);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!profileRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    function syncSidebarClasses() {
      setSidebarClasses(
        parseSidebarClasses(window.localStorage.getItem(CLASSES_STORAGE_KEY)),
      );
      setIsSidebarClassesReady(true);
    }

    function handleStorage(event: StorageEvent) {
      if (event.key && event.key !== CLASSES_STORAGE_KEY) {
        return;
      }

      syncSidebarClasses();
    }

    function handleClassesUpdated() {
      syncSidebarClasses();
    }

    syncSidebarClasses();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("studyapp-classes-updated", handleClassesUpdated);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(
        "studyapp-classes-updated",
        handleClassesUpdated,
      );
    };
  }, []);

  function handleToggleCollapse() {
    setIsProfileMenuOpen(false);
    onToggleCollapse();
  }

  function handleNavigate() {
    setIsProfileMenuOpen(false);
    onCloseMobile();
  }

  function handleToggleClassChapters(classId: number) {
    setExpandedClassIds((current) =>
      current.includes(classId)
        ? current.filter((item) => item !== classId)
        : [...current, classId],
    );
  }

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ""} ${isMobileOpen ? styles.sidebarMobileOpen : ""}`}
    >
      <button
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={styles.sidebarToggle}
        onClick={handleToggleCollapse}
        type='button'
      >
        <svg aria-hidden='true' viewBox='0 0 24 24'>
          {isCollapsed ? (
            <>
              <path d='m8 7 5 5-5 5' />
              <path d='m12 7 5 5-5 5' />
            </>
          ) : (
            <>
              <path d='m16 7-5 5 5 5' />
              <path d='m12 7-5 5 5 5' />
            </>
          )}
        </svg>
      </button>
      <button
        aria-label='Close sidebar'
        className={styles.mobileCloseButton}
        onClick={onCloseMobile}
        type='button'
      >
        <svg aria-hidden='true' viewBox='0 0 24 24'>
          <path d='m6 6 12 12M18 6 6 18' />
        </svg>
      </button>
      <div className={styles.sidebarInner}>
        <div className={styles.sidebarHeader}>
          <Link
            className={styles.sidebarBrand}
            href='/app'
            onClick={handleNavigate}
          >
            Study App
          </Link>
        </div>

        <nav className={styles.sidebarNav} aria-label='Dashboard navigation'>
          {navItems.map((item) => {
            const isActive =
              item.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.href);
            const isClassesItem = item.href === "/app/classes";

            return (
              <div className={styles.sidebarNavItem} key={item.href}>
                <Link
                  className={
                    isActive ? styles.sidebarLinkActive : styles.sidebarLink
                  }
                  href={item.href}
                  onClick={handleNavigate}
                >
                  <span className={styles.sidebarIcon}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>

                {isClassesItem && shouldShowClassesSubsection ? (
                  <div
                    className={`${styles.sidebarClassSection} ${isClassesRoute ? styles.sidebarClassSectionOpen : ""}`}
                  >
                    <div className={styles.sidebarClassSectionInner}>
                      {!isSidebarClassesReady ? (
                        <div className={styles.sidebarClassLoading}>
                          <CircularLoader label='Loading classes' size={18} />
                        </div>
                      ) : (
                        <div className={styles.sidebarClassList}>
                          {sidebarClasses.map((classItem) => {
                            const isClassRouteActive =
                              pathname === `/app/classes/${classItem.id}`;
                            const isClassExpanded = expandedClassIds.includes(
                              classItem.id,
                            );

                            return (
                              <div
                                className={
                                  isClassRouteActive
                                    ? styles.sidebarClassItemActive
                                    : styles.sidebarClassItem
                                }
                                key={classItem.id}
                              >
                                <button
                                  className={
                                    isClassRouteActive
                                      ? styles.sidebarClassToggleActive
                                      : styles.sidebarClassToggle
                                  }
                                  onClick={() =>
                                    handleToggleClassChapters(classItem.id)
                                  }
                                  type='button'
                                >
                                  <span
                                    className={`${styles.sidebarClassChevron} ${isClassExpanded ? styles.sidebarClassChevronOpen : ""}`}
                                    aria-hidden='true'
                                  >
                                    <svg viewBox='0 0 24 24'>
                                      <path d='m9 6 6 6-6 6' />
                                    </svg>
                                  </span>
                                  <span className={styles.sidebarClassText}>
                                    {classItem.className}
                                  </span>
                                </button>

                                <div
                                  className={`${styles.sidebarChapterSection} ${isClassExpanded ? styles.sidebarChapterSectionOpen : ""}`}
                                >
                                  <div className={styles.sidebarChapterInner}>
                                    <div className={styles.sidebarChapterList}>
                                      {CHAPTER_PLACEHOLDERS.map((chapter) => (
                                        <div
                                          key={`${classItem.id}-${chapter}`}
                                          className={
                                            styles.sidebarChapterItemContainer
                                          }
                                        >
                                          <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='800px'
                                            height='800px'
                                            viewBox='0 0 24 24'
                                            fill='none'
                                            className={
                                              styles.sidebarChapterItemBook
                                            }
                                          >
                                            <path
                                              d='M4 19V6.2C4 5.0799 4 4.51984 4.21799 4.09202C4.40973 3.71569 4.71569 3.40973 5.09202 3.21799C5.51984 3 6.0799 3 7.2 3H16.8C17.9201 3 18.4802 3 18.908 3.21799C19.2843 3.40973 19.5903 3.71569 19.782 4.09202C20 4.51984 20 5.0799 20 6.2V17H6C4.89543 17 4 17.8954 4 19ZM4 19C4 20.1046 4.89543 21 6 21H20M9 7H15M9 11H15M19 17V21'
                                              stroke='#000000'
                                              stroke-width='2'
                                              stroke-linecap='round'
                                              stroke-linejoin='round'
                                            />
                                          </svg>
                                          <span
                                            className={
                                              styles.sidebarChapterItem
                                            }
                                          >
                                            {chapter}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <ThemeToggle
            className={styles.sidebarThemeToggle}
            ariaLabel='Dashboard theme'
          />
          <div className={styles.profileWrap} ref={profileRef}>
            {isProfileMenuOpen ? (
              <div
                className={styles.profileMenu}
                role='menu'
                aria-label='Profile menu'
              >
                <Link
                  className={styles.profileMenuAction}
                  href='/app'
                  onClick={handleNavigate}
                >
                  Manage subscription
                </Link>
                <Link
                  className={styles.profileMenuAction}
                  href='/contact'
                  onClick={handleNavigate}
                >
                  Contact us
                </Link>
                <Link
                  className={styles.profileMenuAction}
                  href='/'
                  onClick={handleNavigate}
                >
                  Sign out
                </Link>
              </div>
            ) : null}

            <button
              className={styles.profileButton}
              onClick={() => setIsProfileMenuOpen((current) => !current)}
              type='button'
              aria-expanded={isProfileMenuOpen}
              aria-haspopup='menu'
            >
              <span className={styles.profileAvatar} aria-hidden='true'>
                TA
              </span>
              <span className={styles.profileCopy}>
                <span className={styles.profileName}>Tanyu A.</span>
                <span className={styles.profilePlan}>Free</span>
              </span>
              <span className={styles.profileChevron} aria-hidden='true'>
                <svg viewBox='0 0 24 24'>
                  <path d='m6 15 6-6 6 6' />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
