import type { CohortSeed } from "../types";

const cohort: CohortSeed = {
  type: "cohort",
  course: "quest-data-analytics",
  slug: "azam-2026",
  title: "Azam College · BCA 2026–27",
  institution: "Azam College",
  weekdays: [2, 4], // Tuesday, Thursday
  startTime: "13:30",
  endTime: "15:00",
  timezone: "Asia/Kolkata",
  startDate: "2026-10-13",
  // Add college holidays here (or in Admin → Settings), then rebuild the schedule.
  holidays: [],
  classroomUrl: undefined,
  classroomCode: undefined,
  // Initial PIN. Change it in Admin → Settings before the first quiz.
  quizPin: "2026",
};

export default cohort;
