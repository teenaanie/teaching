import type { CourseSeed } from "../types";

/** Tiny course used to check that cohorts and courses stay independent. */
const course: CourseSeed = {
  type: "course",
  slug: "demo-spreadsheets",
  title: "Spreadsheet Basics (demo)",
  modules: [
    {
      slug: "sheets",
      title: "Google Sheets",
      grading: { attendance: 50, quiz: 50 },
      lessons: [
        { slug: "cells", title: "Cells and formulas", summary: "Typing data and your first =SUM()." },
        { slug: "charts", title: "Charts", summary: "Turning a table into a chart.", slots: 2 },
      ],
      assessments: [
        {
          slug: "quiz-sheets",
          kind: "quiz",
          title: "Quiz: Sheets",
          maxScore: 10,
          lesson: "charts",
          questions: [
            { prompt: "Which formula adds A1 to A5?", options: ["=ADD(A1:A5)", "=SUM(A1:A5)", "=TOTAL(A1:A5)"], answer: 1 },
            { prompt: "Which chart shows a trend over time?", options: ["Pie", "Line", "Table"], answer: 1 },
          ],
        },
      ],
    },
  ],
};

export default course;
