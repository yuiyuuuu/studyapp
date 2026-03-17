"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import styles from "./dashboard.module.css";

type EventPriority = "critical" | "high" | "medium" | "low" | "optional";

type CalendarEvent = {
  id: string;
  title: string;
  notes: string;
  time: string;
  priority: EventPriority;
};

type EventsByDate = Record<string, CalendarEvent[]>;

const STORAGE_KEY = "studyapp-calendar-events";
const MAX_DAY_EVENT_DOTS = 5;
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PRIORITY_OPTIONS: Array<{
  value: EventPriority;
  label: string;
  color: string;
}> = [
  { value: "critical", label: "Critical", color: "#7c3aed" },
  { value: "high", label: "High Priority", color: "#ef4444" },
  { value: "medium", label: "Medium Priority", color: "#f97316" },
  { value: "low", label: "Low Priority", color: "#eab308" },
  { value: "optional", label: "Optional", color: "#22c55e" },
];
const DEFAULT_PRIORITY: EventPriority = "medium";
const PRIORITY_RANK: Record<EventPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  optional: 4,
};

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatReadableDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function shiftDate(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function normalizePriority(value: unknown): EventPriority {
  return PRIORITY_OPTIONS.some((option) => option.value === value)
    ? (value as EventPriority)
    : DEFAULT_PRIORITY;
}

function getPriorityOption(priority: EventPriority) {
  return (
    PRIORITY_OPTIONS.find((option) => option.value === priority) ??
    PRIORITY_OPTIONS[2]
  );
}

function formatEventTime(time: string) {
  if (!time) {
    return "No time set";
  }

  const [hoursRaw, minutesRaw] = time.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return time;
  }

  const helperDate = new Date();
  helperDate.setHours(hours, minutes, 0, 0);

  return helperDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getYearOptions() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 31 }, (_, index) => currentYear - 15 + index);
}

function parseStoredEvents(rawValue: string | null): EventsByDate {
  if (!rawValue) {
    return {};
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    const normalized: EventsByDate = {};

    for (const [key, value] of Object.entries(parsed)) {
      if (!Array.isArray(value)) {
        continue;
      }

      normalized[key] = value
        .filter(
          (item): item is CalendarEvent =>
            Boolean(item) &&
            typeof item === "object" &&
            typeof (item as CalendarEvent).id === "string" &&
            typeof (item as CalendarEvent).title === "string" &&
            typeof (item as CalendarEvent).notes === "string",
        )
        .map((item) => ({
          id: item.id,
          title: item.title,
          notes: item.notes,
          time: typeof item.time === "string" ? item.time : "",
          priority: normalizePriority(
            (item as { priority?: unknown }).priority,
          ),
        }));
    }

    return normalized;
  } catch {
    return {};
  }
}

function getInitialEvents(): EventsByDate {
  if (typeof window === "undefined") {
    return {};
  }

  return parseStoredEvents(window.localStorage.getItem(STORAGE_KEY));
}

type PriorityPickerProps = {
  value: EventPriority;
  onChange: (nextValue: EventPriority) => void;
  ariaLabel: string;
};

function PriorityPicker({ value, onChange, ariaLabel }: PriorityPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const selectedOption = getPriorityOption(value);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div className={`${styles.priorityPicker}`} ref={wrapperRef}>
      <button
        type='button'
        className={`${styles.priorityTrigger} ${styles.priorityCursor}`}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span
          className={styles.priorityDot}
          aria-hidden='true'
          style={{ "--priority-color": selectedOption.color } as CSSProperties}
        />
        <span className={styles.priorityText}>{selectedOption.label}</span>
        <span className={styles.priorityChevron} aria-hidden='true'>
          <svg viewBox='0 0 24 24'>
            <path d='m6 9 6 6 6-6' />
          </svg>
        </span>
      </button>

      {isOpen ? (
        <div
          className={styles.priorityMenu}
          role='listbox'
          aria-label={ariaLabel}
        >
          {PRIORITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type='button'
              role='option'
              aria-selected={value === option.value}
              className={`${styles.priorityMenuItem} ${styles.priorityCursor} ${value === option.value ? styles.priorityMenuItemActive : ""}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <span
                className={styles.priorityDot}
                aria-hidden='true'
                style={{ "--priority-color": option.color } as CSSProperties}
              />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function InteractiveCalendar() {
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [eventsByDate, setEventsByDate] =
    useState<EventsByDate>(getInitialEvents);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newPriority, setNewPriority] =
    useState<EventPriority>(DEFAULT_PRIORITY);
  const [newNotes, setNewNotes] = useState("");
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingTime, setEditingTime] = useState("");
  const [editingPriority, setEditingPriority] =
    useState<EventPriority>(DEFAULT_PRIORITY);
  const [editingNotes, setEditingNotes] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(eventsByDate));
  }, [eventsByDate]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedDate(null);
        setEditingEventId(null);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const leadingEmptyDays = Array.from({ length: firstDayIndex }, (_, i) => i);
  const selectedDateKey = selectedDate ? toDateKey(selectedDate) : null;
  const selectedEvents = selectedDateKey
    ? (eventsByDate[selectedDateKey] ?? [])
    : [];

  function updateMonth(year: number, month: number) {
    setViewYear(year);
    setViewMonth(month);
  }

  function goToNextMonth() {
    const next = new Date(viewYear, viewMonth + 1, 1);
    updateMonth(next.getFullYear(), next.getMonth());
  }

  function goToPreviousMonth() {
    const prev = new Date(viewYear, viewMonth - 1, 1);
    updateMonth(prev.getFullYear(), prev.getMonth());
  }

  function openDate(day: number) {
    setSelectedDate(new Date(viewYear, viewMonth, day));
    setEditingEventId(null);
    setEditingTime("");
    setEditingPriority(DEFAULT_PRIORITY);
  }

  function closeModal() {
    setSelectedDate(null);
    setEditingEventId(null);
    setEditingTime("");
    setEditingPriority(DEFAULT_PRIORITY);
  }

  function goToAdjacentDay(amount: number) {
    if (!selectedDate) {
      return;
    }

    const nextDate = shiftDate(selectedDate, amount);
    setSelectedDate(nextDate);
    setViewYear(nextDate.getFullYear());
    setViewMonth(nextDate.getMonth());
    setEditingEventId(null);
    setEditingTime("");
    setEditingPriority(DEFAULT_PRIORITY);
  }

  function addEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedDateKey) {
      return;
    }

    const title = newTitle.trim();
    const notes = newNotes.trim();

    if (!title) {
      return;
    }

    const entry: CalendarEvent = {
      id: typeof crypto !== "undefined" ? crypto.randomUUID() : `${Date.now()}`,
      title,
      notes,
      time: newTime,
      priority: newPriority,
    };

    setEventsByDate((current) => ({
      ...current,
      [selectedDateKey]: [...(current[selectedDateKey] ?? []), entry],
    }));

    setNewTitle("");
    setNewTime("");
    setNewPriority(DEFAULT_PRIORITY);
    setNewNotes("");
  }

  function deleteEvent(eventId: string) {
    if (!selectedDateKey) {
      return;
    }

    setEventsByDate((current) => {
      const nextEntries = (current[selectedDateKey] ?? []).filter(
        (entry) => entry.id !== eventId,
      );

      if (nextEntries.length === 0) {
        const next = { ...current };
        delete next[selectedDateKey];
        return next;
      }

      return {
        ...current,
        [selectedDateKey]: nextEntries,
      };
    });

    if (editingEventId === eventId) {
      setEditingEventId(null);
    }
  }

  function startEditing(entry: CalendarEvent) {
    setEditingEventId(entry.id);
    setEditingTitle(entry.title);
    setEditingTime(entry.time);
    setEditingPriority(entry.priority);
    setEditingNotes(entry.notes);
  }

  function saveEdit(entryId: string) {
    if (!selectedDateKey) {
      return;
    }

    const title = editingTitle.trim();

    if (!title) {
      return;
    }

    setEventsByDate((current) => ({
      ...current,
      [selectedDateKey]: (current[selectedDateKey] ?? []).map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              title,
              time: editingTime,
              priority: editingPriority,
              notes: editingNotes.trim(),
            }
          : entry,
      ),
    }));

    setEditingEventId(null);
  }

  const yearOptions = useMemo(() => getYearOptions(), []);

  return (
    <div className={styles.calendarSection}>
      <div className={styles.calendarHeaderRow}>
        <div className={styles.calendarMonthControls}>
          <button
            type='button'
            className={styles.calendarIconButton}
            onClick={goToPreviousMonth}
            aria-label='Previous month'
          >
            <svg aria-hidden='true' viewBox='0 0 24 24'>
              <path d='m15 6-6 6 6 6' />
            </svg>
          </button>

          <div className={styles.calendarSelectGroup}>
            <label className={styles.calendarLabel}>
              Month
              <select
                className={styles.calendarSelect}
                value={viewMonth}
                onChange={(event) => setViewMonth(Number(event.target.value))}
              >
                {MONTH_LABELS.map((monthName, index) => (
                  <option key={monthName} value={index}>
                    {monthName}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.calendarLabel}>
              Year
              <select
                className={styles.calendarSelect}
                value={viewYear}
                onChange={(event) => setViewYear(Number(event.target.value))}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type='button'
            className={styles.calendarIconButton}
            onClick={goToNextMonth}
            aria-label='Next month'
          >
            <svg aria-hidden='true' viewBox='0 0 24 24'>
              <path d='m9 6 6 6-6 6' />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.calendarWeekdays}>
        {WEEKDAY_LABELS.map((label) => (
          <p key={label} className={styles.calendarWeekdayLabel}>
            {label}
          </p>
        ))}
      </div>

      <div className={styles.calendarGrid}>
        {leadingEmptyDays.map((index) => (
          <div
            key={`empty-${index}`}
            className={styles.calendarEmptyCell}
            aria-hidden='true'
          />
        ))}

        {dayNumbers.map((dayNumber) => {
          const date = new Date(viewYear, viewMonth, dayNumber);
          const dateKey = toDateKey(date);
          const dayEvents = eventsByDate[dateKey] ?? [];
          const hasEvents = dayEvents.length > 0;
          const dayEventDots = [...dayEvents]
            .sort(
              (eventA, eventB) =>
                PRIORITY_RANK[eventA.priority] - PRIORITY_RANK[eventB.priority],
            )
            .slice(0, MAX_DAY_EVENT_DOTS);
          const hiddenEventCount = dayEvents.length - dayEventDots.length;
          const isToday = dateKey === toDateKey(today);
          const isSelected = dateKey === selectedDateKey;

          return (
            <button
              key={dateKey}
              type='button'
              className={`${styles.calendarDayButton} ${styles.priorityCursor} ${isToday ? styles.calendarDayToday : ""} ${isSelected ? styles.calendarDaySelected : ""}`}
              onClick={() => openDate(dayNumber)}
              aria-label={`Open ${formatReadableDate(date)}`}
            >
              <span className={styles.calendarDayNumber}>{dayNumber}</span>
              {isToday ? (
                <span className={styles.calendarTodayBadge} aria-hidden='true'>
                  Today
                </span>
              ) : null}
              {hasEvents ? (
                <span className={styles.calendarDayDots} aria-hidden='true'>
                  {dayEventDots.map((entry) => (
                    <span
                      key={entry.id}
                      className={styles.calendarDayDot}
                      style={
                        {
                          "--priority-color": getPriorityOption(entry.priority)
                            .color,
                        } as CSSProperties
                      }
                    />
                  ))}
                  {hiddenEventCount > 0 ? (
                    <span className={styles.calendarDayOverflowCount}>
                      +{hiddenEventCount}
                    </span>
                  ) : null}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {selectedDate ? (
        <div
          className={styles.calendarModalOverlay}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className={styles.calendarModal} role='dialog' aria-modal='true'>
            <div className={styles.calendarModalInner}>
              <button
                type='button'
                className={styles.modalCloseButton}
                onClick={closeModal}
                aria-label='Close'
              >
                <svg aria-hidden='true' viewBox='0 0 24 24'>
                  <path d='m6 6 12 12M18 6 6 18' />
                </svg>
              </button>

              <div className={styles.calendarModalHeader}>
                <div>
                  {/* <p className={styles.cardLabel}>Selected date</p> */}
                  <h3 className={styles.cardTitle}>
                    {formatReadableDate(selectedDate)}
                  </h3>
                </div>
                <div className={styles.calendarModalNav}>
                  <button
                    type='button'
                    className={`${styles.calendarNavButton} ${styles.priorityCursor}`}
                    onClick={() => goToAdjacentDay(-1)}
                  >
                    Previous day
                  </button>
                  <button
                    type='button'
                    className={`${styles.calendarNavButton} ${styles.priorityCursor}`}
                    onClick={() => goToAdjacentDay(1)}
                  >
                    Next day
                  </button>
                </div>
              </div>

              <div className={styles.calendarEventsWrap}>
                <p className={styles.cardLabel}>Events</p>

                {selectedEvents.length === 0 ? (
                  <p className={styles.calendarEmptyMessage}>
                    No events yet for this day.
                  </p>
                ) : (
                  <div className={styles.calendarEventsList}>
                    {selectedEvents.map((entry) => (
                      <article
                        className={styles.calendarEventItem}
                        key={entry.id}
                      >
                        {editingEventId === entry.id ? (
                          <div className={styles.calendarEditFields}>
                            <input
                              className={styles.calendarInput}
                              value={editingTitle}
                              onChange={(event) =>
                                setEditingTitle(event.target.value)
                              }
                              placeholder='Event title'
                            />
                            <label className={styles.calendarLabel}>
                              Time
                              <input
                                className={styles.calendarInput}
                                type='time'
                                value={editingTime}
                                onChange={(event) =>
                                  setEditingTime(event.target.value)
                                }
                              />
                            </label>
                            <label className={styles.calendarLabel}>
                              Priority
                              <PriorityPicker
                                ariaLabel='Edit event priority'
                                value={editingPriority}
                                onChange={setEditingPriority}
                              />
                            </label>
                            <textarea
                              className={styles.calendarTextarea}
                              value={editingNotes}
                              onChange={(event) =>
                                setEditingNotes(event.target.value)
                              }
                              placeholder='Notes'
                              rows={3}
                            />
                            <div className={styles.calendarEventActions}>
                              <button
                                type='button'
                                className={styles.calendarActionButton}
                                onClick={() => saveEdit(entry.id)}
                              >
                                Save
                              </button>
                              <button
                                type='button'
                                className={styles.calendarActionButton}
                                onClick={() => setEditingEventId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className={styles.calendarEventCopy}>
                              <p className={styles.calendarEventTitle}>
                                {entry.title}
                              </p>
                              <div className={styles.calendarEventMeta}>
                                <p className={styles.calendarEventTime}>
                                  {formatEventTime(entry.time)}
                                </p>
                                <span className={styles.calendarPriorityPill}>
                                  <span
                                    className={styles.priorityDot}
                                    aria-hidden='true'
                                    style={
                                      {
                                        "--priority-color": getPriorityOption(
                                          entry.priority,
                                        ).color,
                                      } as CSSProperties
                                    }
                                  />
                                  <span>
                                    {getPriorityOption(entry.priority).label}
                                  </span>
                                </span>
                              </div>
                              {entry.notes ? (
                                <p className={styles.calendarEventNotes}>
                                  {entry.notes}
                                </p>
                              ) : null}
                            </div>
                            <div className={styles.calendarEventActions}>
                              <button
                                type='button'
                                className={styles.calendarActionButton}
                                onClick={() => startEditing(entry)}
                              >
                                Modify
                              </button>
                              <button
                                type='button'
                                className={`${styles.calendarActionButton} ${styles.calendarDeleteButton}`}
                                onClick={() => deleteEvent(entry.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <form className={styles.calendarAddForm} onSubmit={addEvent}>
                <p className={styles.cardLabel}>Add event</p>
                <input
                  className={styles.calendarInput}
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  placeholder='Event title'
                  required
                />
                <label className={styles.calendarLabel}>
                  Time
                  <input
                    className={`${styles.calendarInput} ${styles.priorityCursor}`}
                    type='time'
                    value={newTime}
                    onChange={(event) => setNewTime(event.target.value)}
                  />
                </label>
                <label className={styles.calendarLabel}>
                  Priority
                  <PriorityPicker
                    ariaLabel='Add event priority'
                    value={newPriority}
                    onChange={setNewPriority}
                  />
                </label>
                <textarea
                  className={styles.calendarTextarea}
                  value={newNotes}
                  onChange={(event) => setNewNotes(event.target.value)}
                  placeholder='Notes (optional)'
                  rows={3}
                />
                <button type='submit' className={styles.calendarSubmitButton}>
                  Add event
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
