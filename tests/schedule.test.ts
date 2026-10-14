import { test } from "node:test";
import assert from "node:assert/strict";
import { planSessions, zonedToUtc } from "../src/lib/schedule";

const azam = {
  weekdays: [2, 4],
  startDate: "2026-10-13",
  startTime: "13:30",
  endTime: "15:00",
  timezone: "Asia/Kolkata",
  holidays: ["2026-10-20"],
};

test("converts IST wall clock to UTC", () => {
  assert.equal(zonedToUtc("2026-10-13", "13:30", "Asia/Kolkata"), "2026-10-13T08:00:00.000Z");
});

test("handles a DST zone", () => {
  assert.equal(zonedToUtc("2026-07-01", "09:00", "America/New_York"), "2026-07-01T13:00:00.000Z");
  assert.equal(zonedToUtc("2026-12-01", "09:00", "America/New_York"), "2026-12-01T14:00:00.000Z");
});

test("places lessons on Tue/Thu in order, skipping holidays, spreading multi-slot lessons", () => {
  const plan = planSessions(azam, [
    { lessonId: "a", slots: 1 },
    { lessonId: "b", slots: 2 },
    { lessonId: "c", slots: 1 },
  ]);
  assert.deepEqual(
    plan.map((p) => [p.lessonId, p.part, p.date]),
    [
      ["a", 1, "2026-10-13"],
      ["b", 1, "2026-10-15"],
      ["b", 2, "2026-10-22"],
      ["c", 1, "2026-10-27"],
    ],
  );
  for (const p of plan) {
    const day = new Date(p.date + "T00:00:00Z").getUTCDay();
    assert.ok(day === 2 || day === 4);
    assert.equal(p.startsAt.slice(11, 16), "08:00");
    assert.equal(p.endsAt.slice(11, 16), "09:30");
  }
  assert.deepEqual(plan.map((p) => p.position), [1, 2, 3, 4]);
});
