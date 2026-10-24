// All localStorage access goes through here. Keys are prefixed with "arena:".
// Components subscribe with the hooks at the bottom and re-render on change.

import { useSyncExternalStore } from "react";

const PREFIX = "arena:";
const EVENT = "arena-storage";
const HISTORY_LIMIT = 20;
const MARATHON_LIMIT = 50;

function hasStorage() {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

function readRaw(key) {
  if (!hasStorage()) return null;
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

function read(key, fallback) {
  const raw = readRaw(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value, { silent = false } = {}) {
  if (!hasStorage()) return;
  try {
    if (value === undefined || value === null) window.localStorage.removeItem(PREFIX + key);
    else window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // quota exceeded or blocked storage: progress just isn't saved
  }
  cache.delete(key);
  if (!silent) window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
}

// Snapshot cache so useSyncExternalStore gets stable references.
const cache = new Map();
function cached(key, fallback) {
  if (!cache.has(key)) cache.set(key, read(key, fallback));
  return cache.get(key);
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key && e.key.startsWith(PREFIX)) {
      cache.delete(e.key.slice(PREFIX.length));
      window.dispatchEvent(new CustomEvent(EVENT, { detail: e.key.slice(PREFIX.length) }));
    }
  });
}

// ---------- progress ----------

const EMPTY = Object.freeze({});

export function getProgress() {
  return cached("progress", EMPTY);
}

function updateProgress(slug, patch) {
  const all = { ...getProgress() };
  all[slug] = { ...(all[slug] || {}), ...patch };
  write("progress", all);
  return all[slug];
}

export function markOpened(slug) {
  updateProgress(slug, { lastOpenedAt: Date.now() });
  write("lastProblem", slug);
}

export function markAttempted(slug) {
  const p = getProgress()[slug] || {};
  if (p.status === "solved" || p.status === "attempted") return;
  updateProgress(slug, { status: "attempted" });
}

/** Returns true when this is the first time the problem is solved. */
export function markSolved(slug) {
  const p = getProgress()[slug] || {};
  if (p.status === "solved") return false;
  updateProgress(slug, { status: "solved", solvedAt: Date.now() });
  return true;
}

export function markAnswerViewed(slug) {
  updateProgress(slug, { answerViewed: true });
}

export function getLastProblem() {
  return read("lastProblem", null);
}

// ---------- code ----------

function codeKey(slug, lang, scope) {
  return scope ? `mcode:${scope}:${slug}:${lang}` : `code:${slug}:${lang}`;
}

export function getCode(slug, lang, scope) {
  return read(codeKey(slug, lang, scope), null);
}

export function setCode(slug, lang, code, scope) {
  write(codeKey(slug, lang, scope), code, { silent: true });
}

export function clearCode(slug, lang, scope) {
  write(codeKey(slug, lang, scope), null, { silent: true });
}

// ---------- history ----------

export function getHistory(slug) {
  return cached(`history:${slug}`, []);
}

export function addHistory(slug, entry) {
  const list = [{ ...entry, at: Date.now() }, ...getHistory(slug)].slice(0, HISTORY_LIMIT);
  write(`history:${slug}`, list);
}

// ---------- settings ----------

export const DEFAULT_SETTINGS = Object.freeze({
  language: "javascript",
  fontSize: 15,
  tabSize: 4,
  textSize: "comfortable",
});

export function getSettings() {
  const s = cached("settings", null);
  if (!s) return DEFAULT_SETTINGS;
  return s;
}

export function setSettings(patch) {
  write("settings", { ...DEFAULT_SETTINGS, ...getSettings(), ...patch });
}

// react-resizable-panels storage adapter (keys end up as arena:layout:...)
export const layoutStorage = {
  getItem: (k) => readRaw(`layout:${k}`),
  setItem: (k, v) => {
    try {
      window.localStorage.setItem(`${PREFIX}layout:${k}`, v);
    } catch {
      // ignore
    }
  },
};

// ---------- marathon ----------

export function getActiveMarathon() {
  return cached("marathon:active", null);
}

export function setActiveMarathon(m) {
  write("marathon:active", m);
}

export function getMarathons() {
  return cached("marathons", []);
}

export function saveMarathonResult(m) {
  const list = [m, ...getMarathons().filter((x) => x.id !== m.id)].slice(0, MARATHON_LIMIT);
  write("marathons", list);
}

export function deleteMarathonResult(id) {
  write("marathons", getMarathons().filter((x) => x.id !== id));
}

// ---------- export / import ----------

export function exportAll() {
  const data = {};
  if (hasStorage()) {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(PREFIX)) data[k.slice(PREFIX.length)] = window.localStorage.getItem(k);
    }
  }
  return { app: "dsa-arena", version: 1, exportedAt: new Date().toISOString(), data };
}

export function importAll(json) {
  if (!json || json.app !== "dsa-arena" || typeof json.data !== "object") {
    throw new Error("This file is not a DSA Arena backup.");
  }
  let count = 0;
  for (const [k, v] of Object.entries(json.data)) {
    if (typeof v !== "string") continue;
    try {
      window.localStorage.setItem(PREFIX + k, v);
      count++;
    } catch {
      // skip entries that do not fit
    }
  }
  cache.clear();
  window.dispatchEvent(new CustomEvent(EVENT, { detail: "*" }));
  return count;
}

// ---------- hooks ----------

function subscribe(fn) {
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
}

export function useStored(getter, serverValue) {
  return useSyncExternalStore(subscribe, getter, () => serverValue);
}

export function useProgress() {
  return useStored(getProgress, EMPTY);
}

export function useSettings() {
  return useStored(getSettings, DEFAULT_SETTINGS);
}

const EMPTY_LIST = Object.freeze([]);

export function useHistory(slug) {
  return useStored(() => getHistory(slug), EMPTY_LIST);
}

export function useActiveMarathon() {
  return useStored(getActiveMarathon, null);
}

export function useMarathons() {
  return useStored(getMarathons, EMPTY_LIST);
}
