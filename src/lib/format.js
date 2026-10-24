const MAX = 4000;

/** JSON-ish display of a value, LeetCode style (strings keep their quotes). */
export function show(v, max = MAX) {
  if (v === undefined) return "";
  let s;
  try {
    s = JSON.stringify(v);
  } catch {
    s = String(v);
  }
  if (s === undefined) s = String(v);
  if (s.length > max) return `${s.slice(0, max)} … (${(s.length - max).toLocaleString()} more characters)`;
  return s;
}

export function formatMs(ms) {
  if (ms === undefined || ms === null) return "";
  if (ms < 1) return "< 1 ms";
  return `${Math.round(ms)} ms`;
}

export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

export function timeAgo(ts) {
  const d = (Date.now() - ts) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)} min ago`;
  if (d < 86400) return `${Math.floor(d / 3600)} h ago`;
  if (d < 86400 * 7) return `${Math.floor(d / 86400)} d ago`;
  return new Date(ts).toLocaleDateString();
}
