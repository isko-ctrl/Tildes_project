"use client";
import { useCallback, useSyncExternalStore } from "react";
import type { Lang } from "@/lib/lessons/langs";
import { emptyState, load, save, type State } from "./store";

const EVENT = "tildes:change";
const KEY = "tildes:v1";
let cache: { raw: string | null; state: State } | null = null;

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => { window.removeEventListener(EVENT, cb); window.removeEventListener("storage", cb); };
}
function getSnapshot(): State {
  let raw: string | null = null;
  try { raw = localStorage.getItem(KEY); } catch { /* жоқ */ }
  if (!cache || cache.raw !== raw) cache = { raw, state: raw ? load() : emptyState() };
  return cache.state;
}

export function useLearning() {
  const s = useSyncExternalStore<State | null>(subscribe, getSnapshot, () => null);
  const mutate = useCallback(<T,>(fn: (draft: State) => T): T => {
    const draft = load();
    const result = fn(draft);
    save(draft);
    window.dispatchEvent(new Event(EVENT));
    return result;
  }, []);
  return { s, mutate };
}

export function useLang(): [Lang, (l: Lang) => void] {
  const { s, mutate } = useLearning();
  return [s?.lang ?? "ru", (l) => mutate((d) => { d.lang = l; })];
}
