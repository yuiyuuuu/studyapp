"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import styles from "@/components/dashboard/dashboard.module.css";

const CLASSES_STORAGE_KEY = "studyapp-classes";

const WEEKDAY_OPTIONS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const IMPORTANT_DATE_TYPES = [
  "Quiz",
  "Unit",
  "Midterm",
  "Finals",
  "Project",
  "Essay",
] as const;

type Weekday = (typeof WEEKDAY_OPTIONS)[number];
type ImportantDateType = (typeof IMPORTANT_DATE_TYPES)[number];

type ClassScheduleEntry = {
  day: Weekday;
  startTime: string;
  endTime: string;
};

type ImportantDateEntry = {
  date: string;
  type: ImportantDateType;
};

type StoredClass = {
  id: number;
  className: string;
  classSchedule: ClassScheduleEntry[];
  importantDates: ImportantDateEntry[];
};

type ScheduleRow = {
  rowId: number;
  day: Weekday | "";
  startTime: string;
  endTime: string;
};

type ImportantDateRow = {
  rowId: number;
  date: string;
  type: ImportantDateType | "";
};

type ScheduleRowErrors = {
  day?: string;
  startTime?: string;
  endTime?: string;
};

type ImportantDateRowErrors = {
  date?: string;
  type?: string;
};

type FormErrors = {
  className?: string;
  classSchedule?: string;
  scheduleRows: Record<number, ScheduleRowErrors>;
  importantDateRows: Record<number, ImportantDateRowErrors>;
};

function createScheduleRow(rowId: number): ScheduleRow {
  return { rowId, day: "", startTime: "", endTime: "" };
}

function createImportantDateRow(rowId: number): ImportantDateRow {
  return { rowId, date: "", type: "" };
}

function createEmptyErrors(): FormErrors {
  return {
    scheduleRows: {},
    importantDateRows: {},
  };
}

function isWeekday(value: unknown): value is Weekday {
  return WEEKDAY_OPTIONS.includes(value as Weekday);
}

function isImportantDateType(value: unknown): value is ImportantDateType {
  return IMPORTANT_DATE_TYPES.includes(value as ImportantDateType);
}

function parseStoredClasses(rawValue: string | null): StoredClass[] {
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
        (entry): entry is StoredClass =>
          Boolean(entry) &&
          typeof entry === "object" &&
          typeof (entry as StoredClass).id === "number" &&
          typeof (entry as StoredClass).className === "string" &&
          Array.isArray((entry as StoredClass).classSchedule) &&
          Array.isArray((entry as StoredClass).importantDates),
      )
      .map((entry) => {
        const classSchedule = entry.classSchedule.filter(
          (schedule): schedule is ClassScheduleEntry =>
            Boolean(schedule) &&
            typeof schedule === "object" &&
            isWeekday((schedule as ClassScheduleEntry).day) &&
            typeof (schedule as ClassScheduleEntry).startTime === "string" &&
            typeof (schedule as ClassScheduleEntry).endTime === "string",
        );

        const importantDates = entry.importantDates.filter(
          (dateRow): dateRow is ImportantDateEntry =>
            Boolean(dateRow) &&
            typeof dateRow === "object" &&
            typeof (dateRow as ImportantDateEntry).date === "string" &&
            isImportantDateType((dateRow as ImportantDateEntry).type),
        );

        return {
          id: entry.id,
          className: entry.className,
          classSchedule,
          importantDates,
        };
      });
  } catch {
    return [];
  }
}

function getNextClassId(classes: StoredClass[]) {
  if (classes.length === 0) {
    return 1;
  }

  return (
    classes.reduce(
      (maxId, currentClass) => Math.max(maxId, currentClass.id),
      0,
    ) + 1
  );
}

function getWeekdayIndex(day: Weekday) {
  const dayIndexLookup: Record<Weekday, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  return dayIndexLookup[day];
}

function isQuarterHourTime(time: string) {
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
    return false;
  }

  return minutes % 15 === 0;
}

function getNextClassOccurrence(
  classSchedule: ClassScheduleEntry[],
  fromDate: Date,
): Date | null {
  let nextClassDate: Date | null = null;

  classSchedule.forEach((entry) => {
    const [hoursRaw, minutesRaw] = entry.startTime.split(":");
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
      return;
    }

    const dayOffset = (getWeekdayIndex(entry.day) - fromDate.getDay() + 7) % 7;
    const candidateDate = new Date(fromDate);
    candidateDate.setDate(fromDate.getDate() + dayOffset);
    candidateDate.setHours(hours, minutes, 0, 0);

    if (candidateDate <= fromDate) {
      candidateDate.setDate(candidateDate.getDate() + 7);
    }

    if (!nextClassDate || candidateDate < nextClassDate) {
      nextClassDate = candidateDate;
    }
  });

  return nextClassDate;
}

function formatNextClassLabel(date: Date | null) {
  if (!date) {
    return "Next class - Schedule not set";
  }

  return `Next class - ${date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

function ClassesPage() {
  const [storedClasses, setStoredClasses] = useState<StoredClass[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    return parseStoredClasses(window.localStorage.getItem(CLASSES_STORAGE_KEY));
  });
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [showManualEntryForm, setShowManualEntryForm] = useState(false);
  const [className, setClassName] = useState("");
  const [classScheduleRows, setClassScheduleRows] = useState<ScheduleRow[]>([
    createScheduleRow(1),
  ]);
  const [importantDateRows, setImportantDateRows] = useState<
    ImportantDateRow[]
  >([]);
  const [nextRowId, setNextRowId] = useState(2);
  const [formErrors, setFormErrors] = useState<FormErrors>(createEmptyErrors);

  useEffect(() => {
    if (!isAddClassModalOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isAddClassModalOpen]);

  const classRows = useMemo(() => {
    const now = new Date();

    return storedClasses.map((storedClass) => ({
      id: storedClass.id,
      className: storedClass.className,
      nextClassLabel: formatNextClassLabel(
        getNextClassOccurrence(storedClass.classSchedule, now),
      ),
    }));
  }, [storedClasses]);

  function resetClassForm() {
    setShowManualEntryForm(false);
    setClassName("");
    setClassScheduleRows([createScheduleRow(1)]);
    setImportantDateRows([]);
    setNextRowId(2);
    setFormErrors(createEmptyErrors());
  }

  function openAddClassModal() {
    resetClassForm();
    setIsAddClassModalOpen(true);
  }

  function closeAddClassModal() {
    setIsAddClassModalOpen(false);
    resetClassForm();
  }

  function addScheduleDayRow() {
    if (classScheduleRows.length >= 7) {
      return;
    }

    setClassScheduleRows((currentRows) => [
      ...currentRows,
      createScheduleRow(nextRowId),
    ]);
    setNextRowId((currentId) => currentId + 1);
  }

  function removeScheduleDayRow(rowId: number) {
    setClassScheduleRows((currentRows) => {
      if (currentRows.length === 1) {
        return currentRows;
      }

      return currentRows.filter((row) => row.rowId !== rowId);
    });
  }

  function addImportantDateRow() {
    setImportantDateRows((currentRows) => [
      ...currentRows,
      createImportantDateRow(nextRowId),
    ]);
    setNextRowId((currentId) => currentId + 1);
  }

  function removeImportantDateRow(rowId: number) {
    setImportantDateRows((currentRows) =>
      currentRows.filter((row) => row.rowId !== rowId),
    );
  }

  function updateScheduleRow(
    rowId: number,
    field: keyof Omit<ScheduleRow, "rowId">,
    value: string,
  ) {
    setClassScheduleRows((currentRows) =>
      currentRows.map((row) =>
        row.rowId === rowId ? { ...row, [field]: value } : row,
      ),
    );
  }

  function updateImportantDateRow(
    rowId: number,
    field: keyof Omit<ImportantDateRow, "rowId">,
    value: string,
  ) {
    setImportantDateRows((currentRows) =>
      currentRows.map((row) =>
        row.rowId === rowId ? { ...row, [field]: value } : row,
      ),
    );
  }

  function handleManualClassSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = createEmptyErrors();
    const normalizedClassName = className.trim();
    const normalizedSchedule: ClassScheduleEntry[] = [];
    const normalizedImportantDates: ImportantDateEntry[] = [];

    if (!normalizedClassName) {
      nextErrors.className = "Class name is required.";
    }

    if (classScheduleRows.length === 0) {
      nextErrors.classSchedule = "Add at least one class schedule day.";
    }

    classScheduleRows.forEach((row) => {
      const rowErrors: ScheduleRowErrors = {};

      if (!row.day) {
        rowErrors.day = "Select a day.";
      }
      if (!row.startTime) {
        rowErrors.startTime = "Select a start time.";
      }
      if (!row.endTime) {
        rowErrors.endTime = "Select an end time.";
      }

      if (row.startTime && !isQuarterHourTime(row.startTime)) {
        rowErrors.startTime = "Start time must be in 15-minute intervals.";
      }

      if (row.endTime && !isQuarterHourTime(row.endTime)) {
        rowErrors.endTime = "End time must be in 15-minute intervals.";
      }

      if (row.startTime && row.endTime && row.startTime >= row.endTime) {
        rowErrors.endTime = "End time must be after start time.";
      }

      if (Object.keys(rowErrors).length > 0) {
        nextErrors.scheduleRows[row.rowId] = rowErrors;
        return;
      }

      if (!row.day || !isWeekday(row.day)) {
        return;
      }

      normalizedSchedule.push({
        day: row.day,
        startTime: row.startTime,
        endTime: row.endTime,
      });
    });

    if (normalizedSchedule.length === 0) {
      nextErrors.classSchedule = "Class schedule is required.";
    }

    importantDateRows.forEach((row) => {
      const rowErrors: ImportantDateRowErrors = {};
      const hasDate = Boolean(row.date);
      const hasType = Boolean(row.type);

      if (!hasDate && !hasType) {
        return;
      }

      if (!hasDate) {
        rowErrors.date = "Select a date.";
      }

      if (!hasType) {
        rowErrors.type = "Select a type.";
      }

      if (Object.keys(rowErrors).length > 0) {
        nextErrors.importantDateRows[row.rowId] = rowErrors;
        return;
      }

      if (!row.type || !isImportantDateType(row.type)) {
        return;
      }

      normalizedImportantDates.push({
        date: row.date,
        type: row.type,
      });
    });

    const hasErrors =
      Boolean(nextErrors.className) ||
      Boolean(nextErrors.classSchedule) ||
      Object.keys(nextErrors.scheduleRows).length > 0 ||
      Object.keys(nextErrors.importantDateRows).length > 0;

    if (hasErrors) {
      setFormErrors(nextErrors);
      return;
    }

    const nextClass: StoredClass = {
      id: getNextClassId(storedClasses),
      className: normalizedClassName,
      classSchedule: normalizedSchedule,
      importantDates: normalizedImportantDates,
    };

    const nextStoredClasses = [...storedClasses, nextClass];
    setStoredClasses(nextStoredClasses);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        CLASSES_STORAGE_KEY,
        JSON.stringify(nextStoredClasses),
      );
    }

    closeAddClassModal();
  }

  return (
    <div className={styles.pageContent}>
      <header className={styles.pageHeader}>
        <p className={styles.pageEyebrow}>Classes</p>
        <h1 className={styles.pageTitle}>Organize every exam by subject.</h1>
        <p className={styles.pageDescription}>
          Each class becomes a home for uploads, review sets, and progress
          tracking so your study flow stays attached to the course it belongs
          to.
        </p>
      </header>

      {classRows.length === 0 ? (
        <section className={styles.classesEmptyState}>
          <p className={styles.classesEmptyMessage}>No classes added yet.</p>
          <button
            className={styles.addClassButton}
            onClick={openAddClassModal}
            type='button'
          >
            Add a new class
          </button>
        </section>
      ) : (
        <>
          <div className={styles.classesActionRow}>
            <button
              className={styles.addClassButton}
              onClick={openAddClassModal}
              type='button'
            >
              Add a new class
            </button>
          </div>

          <section className={styles.classesList}>
            {classRows.map((classRow) => (
              <Link
                className={styles.classListItem}
                href={`/app/classes/${classRow.id}`}
                key={classRow.id}
              >
                <span className={styles.classListCopy}>
                  <span className={styles.classListName}>
                    {classRow.className}
                  </span>
                  <span className={styles.classListNext}>
                    {classRow.nextClassLabel}
                  </span>
                </span>
                <span className={styles.classListArrow} aria-hidden='true'>
                  <svg viewBox='0 0 24 24'>
                    <path d='m9 6 6 6-6 6' />
                  </svg>
                </span>
              </Link>
            ))}
          </section>
        </>
      )}

      {isAddClassModalOpen ? (
        <div
          aria-modal='true'
          className={styles.classesModalOverlay}
          role='dialog'
        >
          <div className={styles.classesModal}>
            <button
              aria-label='Close add class modal'
              className={styles.modalCloseButton}
              onClick={closeAddClassModal}
              type='button'
            >
              <svg aria-hidden='true' viewBox='0 0 24 24'>
                <path d='m6 6 12 12M18 6 6 18' />
              </svg>
            </button>

            <div className={styles.classesModalInner}>
              <header className={styles.classesModalHeader}>
                <p className={styles.pageEyebrow}>New Class</p>
                <h2 className={styles.classModalTitle}>Add a class</h2>
                {!showManualEntryForm ? (
                  <p className={styles.cardText}>
                    Upload your class syllabus first, or manually enter class
                    information below.
                  </p>
                ) : null}
              </header>

              {!showManualEntryForm ? (
                <div className={styles.classesUploadArea}>
                  <button className={styles.uploadSyllabusButton} type='button'>
                    Upload syllabus PDF
                  </button>
                  <button
                    className={styles.manualEntryTextButton}
                    onClick={() => setShowManualEntryForm(true)}
                    type='button'
                  >
                    Manually enter class info
                  </button>
                </div>
              ) : (
                <form
                  className={styles.classesForm}
                  onSubmit={handleManualClassSubmit}
                >
                  <button
                    className={styles.backToUploadButton}
                    onClick={() => setShowManualEntryForm(false)}
                    type='button'
                  >
                    Back to upload options
                  </button>

                  <label className={styles.classFormLabel}>
                    <span>
                      Class name <span className={styles.requiredMark}>*</span>
                    </span>
                    <input
                      className={styles.classFormInput}
                      onChange={(event) => setClassName(event.target.value)}
                      placeholder='e.g. Biology 210'
                      type='text'
                      value={className}
                    />
                    {formErrors.className ? (
                      <span className={styles.formError}>
                        {formErrors.className}
                      </span>
                    ) : null}
                  </label>

                  <section className={styles.classFormSection}>
                    <div className={styles.classFormSectionHeader}>
                      <h3 className={styles.classSectionTitle}>
                        Class schedule{" "}
                        <span className={styles.requiredMark}>*</span>
                      </h3>
                      <button
                        className={styles.classSectionAction}
                        disabled={classScheduleRows.length >= 7}
                        onClick={addScheduleDayRow}
                        type='button'
                      >
                        Add day
                      </button>
                    </div>
                    {formErrors.classSchedule ? (
                      <p className={styles.formError}>
                        {formErrors.classSchedule}
                      </p>
                    ) : null}
                    <div className={styles.classFormRows}>
                      {classScheduleRows.map((row, index) => (
                        <div
                          className={styles.classFormRowCard}
                          key={row.rowId}
                        >
                          <div className={styles.classFormRowHeader}>
                            <p className={styles.classRowTitle}>
                              Day {index + 1}
                            </p>
                            <button
                              className={styles.classRemoveRowButton}
                              disabled={classScheduleRows.length === 1}
                              onClick={() => removeScheduleDayRow(row.rowId)}
                              type='button'
                            >
                              Remove
                            </button>
                          </div>
                          <div className={styles.classFormRowGrid}>
                            <label className={styles.classFormLabel}>
                              <span>
                                Day of week{" "}
                                <span className={styles.requiredMark}>*</span>
                              </span>
                              <select
                                className={styles.classFormInput}
                                onChange={(event) =>
                                  updateScheduleRow(
                                    row.rowId,
                                    "day",
                                    event.target.value,
                                  )
                                }
                                value={row.day}
                              >
                                <option value=''>Select a day</option>
                                {WEEKDAY_OPTIONS.map((day) => (
                                  <option key={day} value={day}>
                                    {day}
                                  </option>
                                ))}
                              </select>
                              {formErrors.scheduleRows[row.rowId]?.day ? (
                                <span className={styles.formError}>
                                  {formErrors.scheduleRows[row.rowId]?.day}
                                </span>
                              ) : null}
                            </label>

                            <label className={styles.classFormLabel}>
                              <span>
                                Start time{" "}
                                <span className={styles.requiredMark}>*</span>
                              </span>

                              <input
                                className={styles.classFormInput}
                                onChange={(event) =>
                                  updateScheduleRow(
                                    row.rowId,
                                    "startTime",
                                    event.target.value,
                                  )
                                }
                                step={900}
                                type='time'
                                value={row.startTime}
                              />
                              {formErrors.scheduleRows[row.rowId]?.startTime ? (
                                <span className={styles.formError}>
                                  {
                                    formErrors.scheduleRows[row.rowId]
                                      ?.startTime
                                  }
                                </span>
                              ) : null}
                            </label>

                            <label className={styles.classFormLabel}>
                              <span>
                                End time{" "}
                                <span className={styles.requiredMark}>*</span>
                              </span>
                              <input
                                className={styles.classFormInput}
                                onChange={(event) =>
                                  updateScheduleRow(
                                    row.rowId,
                                    "endTime",
                                    event.target.value,
                                  )
                                }
                                step={900}
                                type='time'
                                value={row.endTime}
                              />
                              {formErrors.scheduleRows[row.rowId]?.endTime ? (
                                <span className={styles.formError}>
                                  {formErrors.scheduleRows[row.rowId]?.endTime}
                                </span>
                              ) : null}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className={styles.classFormSection}>
                    <div className={styles.classFormSectionHeader}>
                      <h3 className={styles.classSectionTitle}>
                        Important Dates
                      </h3>
                      <button
                        className={styles.classSectionAction}
                        onClick={addImportantDateRow}
                        type='button'
                      >
                        Add day
                      </button>
                    </div>
                    <p className={styles.classSectionDescription}>
                      Add important dates, such as project / essay deadlines,
                      quizzes, or finals.
                    </p>

                    {importantDateRows.length > 0 ? (
                      <div className={styles.classFormRows}>
                        {importantDateRows.map((row, index) => (
                          <div
                            className={styles.classFormRowCard}
                            key={row.rowId}
                          >
                            <div className={styles.classFormRowHeader}>
                              <p className={styles.classRowTitle}>
                                Date {index + 1}
                              </p>
                              <button
                                className={styles.classRemoveRowButton}
                                onClick={() =>
                                  removeImportantDateRow(row.rowId)
                                }
                                type='button'
                              >
                                Remove
                              </button>
                            </div>
                            <div className={styles.classFormRowGrid}>
                              <label className={styles.classFormLabel}>
                                Date
                                <input
                                  className={styles.classFormInput}
                                  onChange={(event) =>
                                    updateImportantDateRow(
                                      row.rowId,
                                      "date",
                                      event.target.value,
                                    )
                                  }
                                  type='date'
                                  value={row.date}
                                />
                                {formErrors.importantDateRows[row.rowId]
                                  ?.date ? (
                                  <span className={styles.formError}>
                                    {
                                      formErrors.importantDateRows[row.rowId]
                                        ?.date
                                    }
                                  </span>
                                ) : null}
                              </label>

                              <label className={styles.classFormLabel}>
                                Type
                                <select
                                  className={styles.classFormInput}
                                  onChange={(event) =>
                                    updateImportantDateRow(
                                      row.rowId,
                                      "type",
                                      event.target.value,
                                    )
                                  }
                                  value={row.type}
                                >
                                  <option value=''>Select type</option>
                                  {IMPORTANT_DATE_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                      {type}
                                    </option>
                                  ))}
                                </select>
                                {formErrors.importantDateRows[row.rowId]
                                  ?.type ? (
                                  <span className={styles.formError}>
                                    {
                                      formErrors.importantDateRows[row.rowId]
                                        ?.type
                                    }
                                  </span>
                                ) : null}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </section>

                  <div className={styles.classFormFooter}>
                    <button
                      className={styles.classSecondaryButton}
                      onClick={closeAddClassModal}
                      type='button'
                    >
                      Cancel
                    </button>
                    <button className={styles.classPrimaryButton} type='submit'>
                      Submit class
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ClassesPage;
