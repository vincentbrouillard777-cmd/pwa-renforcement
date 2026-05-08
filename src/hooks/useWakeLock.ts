import { useEffect, useRef } from 'react';

type WakeLockSentinelLike = {
  release: () => Promise<void>;
  addEventListener?: (type: string, cb: () => void) => void;
};

type WakeLockApi = {
  request: (type: 'screen') => Promise<WakeLockSentinelLike>;
};

/**
 * Garde l'écran allumé pendant que `active` est true.
 * No-op silencieux si l'API wakeLock n'est pas dispo (iOS < 16.4).
 * Reprend automatiquement le verrou après un retour en visibilité.
 */
export function useWakeLock(active: boolean) {
  const lockRef = useRef<WakeLockSentinelLike | null>(null);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;

    const wl = (navigator as unknown as { wakeLock?: WakeLockApi }).wakeLock;
    if (!wl) return;

    const acquire = async () => {
      try {
        const lock = await wl.request('screen');
        if (cancelled) {
          void lock.release();
          return;
        }
        lockRef.current = lock;
      } catch {
        // ignore
      }
    };

    void acquire();

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && !lockRef.current) {
        void acquire();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibility);
      const lock = lockRef.current;
      if (lock) {
        void lock.release();
        lockRef.current = null;
      }
    };
  }, [active]);
}
