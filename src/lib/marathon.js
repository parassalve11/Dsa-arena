// Marathon: a timed set of questions picked by topic and difficulty.

import { getActiveMarathon, getProgress, saveMarathonResult, setActiveMarathon } from "./storage";

export const MAX_QUESTIONS = 15;

function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function candidates(problems, { topics, difficulties, includeSolved }) {
  const progress = getProgress();
  return problems.filter(
    (p) =>
      (!topics.length || topics.includes(p.topic)) &&
      (!difficulties.length || difficulties.includes(p.difficulty)) &&
      (includeSolved || progress[p.slug]?.status !== "solved")
  );
}

export function createMarathon(problems, options) {
  const pool = candidates(problems, options);
  let picked = options.order === "sheet" ? pool.slice() : shuffle(pool);
  picked = picked.slice(0, Math.min(options.count, MAX_QUESTIONS));
  if (options.order === "sheet") picked.sort((a, b) => a.id - b.id);
  else if (options.order === "easy-first") {
    const rank = { Easy: 0, Medium: 1, Hard: 2 };
    picked.sort((a, b) => rank[a.difficulty] - rank[b.difficulty] || a.id - b.id);
  }
  const now = Date.now();
  const m = {
    id: `m${now.toString(36)}`,
    startedAt: now,
    durationMs: options.minutes * 60 * 1000,
    endsAt: now + options.minutes * 60 * 1000,
    topics: options.topics,
    difficulties: options.difficulties,
    questions: picked.map((p) => ({ slug: p.slug, status: "todo", attempts: 0, solvedAt: null })),
    finishedAt: null,
    reason: null,
  };
  setActiveMarathon(m);
  return m;
}

function patchQuestion(slug, fn) {
  const m = getActiveMarathon();
  if (!m || m.finishedAt) return;
  if (Date.now() > m.endsAt) return;
  const questions = m.questions.map((q) => (q.slug === slug ? fn(q) : q));
  setActiveMarathon({ ...m, questions });
}

export function recordAttempt(slug) {
  patchQuestion(slug, (q) => ({
    ...q,
    attempts: q.attempts + 1,
    status: q.status === "solved" ? "solved" : "attempted",
  }));
}

export function recordSolved(slug) {
  const m = getActiveMarathon();
  patchQuestion(slug, (q) =>
    q.status === "solved" ? q : { ...q, attempts: q.attempts + 1, status: "solved", solvedAt: Date.now() - m.startedAt }
  );
  const after = getActiveMarathon();
  if (after && !after.finishedAt && after.questions.every((q) => q.status === "solved")) finishMarathon("completed");
}

/** Ends the active marathon, saves it to history and returns it. */
export function finishMarathon(reason = "ended") {
  const m = getActiveMarathon();
  if (!m) return null;
  if (m.finishedAt) return m;
  const finishedAt = Math.min(Date.now(), m.endsAt);
  const done = { ...m, finishedAt, reason: reason === "ended" && Date.now() >= m.endsAt ? "time" : reason };
  saveMarathonResult(done);
  setActiveMarathon(null);
  return done;
}

export function summary(m) {
  const solved = m.questions.filter((q) => q.status === "solved").length;
  const used = (m.finishedAt || Date.now()) - m.startedAt;
  return { solved, total: m.questions.length, used };
}
