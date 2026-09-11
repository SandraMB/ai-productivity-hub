import { useCallback, useEffect, useState } from "react";

export type SavedKind = "email" | "plan" | "chat";

export interface SavedItem {
  id: string;
  kind: SavedKind;
  title: string;
  content: string;
  createdAt: string;
}

const KEY = "awpa.saved-work.v1";

function read(): SavedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedItem[]) : [];
  } catch {
    return [];
  }
}

const listeners = new Set<() => void>();
function broadcast() {
  listeners.forEach((l) => l());
}

export function useSavedWork() {
  const [items, setItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);

  const persist = useCallback((next: SavedItem[]) => {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    broadcast();
  }, []);

  const save = useCallback(
    (item: Omit<SavedItem, "id" | "createdAt">) => {
      const next: SavedItem[] = [
        { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
        ...read(),
      ];
      persist(next);
    },
    [persist],
  );

  const remove = useCallback(
    (id: string) => persist(read().filter((i) => i.id !== id)),
    [persist],
  );

  const clear = useCallback(() => persist([]), [persist]);

  return { items, save, remove, clear };
}
