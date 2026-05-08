import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EXERCISES } from '../data/exercises';

export type SessionHistoryEntry = {
  date: string;
  completedIds: string[];
  durationMin: number;
};

type SessionState = {
  active: boolean;
  currentIndex: number;
  completedIds: string[];
  startedAt: number | null;
  history: SessionHistoryEntry[];

  startSession: () => void;
  completeCurrent: () => void;
  skipCurrent: () => void;
  goToPrevious: () => void;
  endSession: () => void;
  abandonSession: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      active: false,
      currentIndex: 0,
      completedIds: [],
      startedAt: null,
      history: [],

      startSession: () =>
        set({
          active: true,
          currentIndex: 0,
          completedIds: [],
          startedAt: Date.now(),
        }),

      completeCurrent: () =>
        set((s) => {
          const ex = EXERCISES[s.currentIndex];
          const id = ex?.id;
          const newCompleted =
            id && !s.completedIds.includes(id)
              ? [...s.completedIds, id]
              : s.completedIds;
          return {
            completedIds: newCompleted,
            currentIndex: Math.min(s.currentIndex + 1, EXERCISES.length),
          };
        }),

      skipCurrent: () =>
        set((s) => ({
          currentIndex: Math.min(s.currentIndex + 1, EXERCISES.length),
        })),

      goToPrevious: () =>
        set((s) => ({
          currentIndex: Math.max(s.currentIndex - 1, 0),
        })),

      endSession: () => {
        const s = get();
        const durationMin = s.startedAt
          ? Math.max(1, Math.round((Date.now() - s.startedAt) / 60000))
          : 0;
        const entry: SessionHistoryEntry = {
          date: new Date().toISOString(),
          completedIds: s.completedIds,
          durationMin,
        };
        set({
          active: false,
          currentIndex: 0,
          completedIds: [],
          startedAt: null,
          history: [entry, ...s.history].slice(0, 50),
        });
      },

      abandonSession: () =>
        set({
          active: false,
          currentIndex: 0,
          completedIds: [],
          startedAt: null,
        }),
    }),
    {
      name: 'pwa-renforcement-session',
      // On ne persiste QUE l'historique. La session active n'est pas restaurée
      // au prochain ouverture (évite la confusion d'état partiel).
      partialize: (s) => ({ history: s.history }) as SessionState,
    }
  )
);
