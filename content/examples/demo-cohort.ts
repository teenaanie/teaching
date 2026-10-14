import type { CohortSeed } from "../types";

const cohort: CohortSeed = {
  type: "cohort",
  course: "demo-spreadsheets",
  slug: "demo-weekend",
  title: "Demo · Weekend batch",
  institution: "Demo Institute",
  weekdays: [6], // Saturday
  startTime: "10:00",
  endTime: "11:30",
  timezone: "Asia/Kolkata",
  startDate: "2026-10-17",
  quizPin: "1111",
  isPublic: false,
  students: [
    { name: "Demo Student One", rollNo: "D1" },
    { name: "Demo Student Two", rollNo: "D2" },
    { name: "Demo Student Three", rollNo: "D3" },
    { name: "Demo Student Four", rollNo: "D4" },
    { name: "Demo Student Five", rollNo: "D5" },
  ],
};

export default cohort;
