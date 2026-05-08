import { useEffect, useRef, useState } from 'react';
import { BipPlayer } from '../components/BipPlayer';

type UseTimerOptions = {
  durationSec: number;
  onComplete?: () => void;
  active: boolean;
  withBips?: boolean;
};

/**
 * Compte à rebours basé sur le temps réel (Date.now), pas sur des intervalles
 * — tolère les pauses navigateur. Bips à T-3, T-2, T-1, ding à T=0.
 */
export function useTimer({ durationSec, onComplete, active, withBips = true }: UseTimerOptions) {
  const [remaining, setRemaining] = useState(durationSec);
  const startTimeRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(durationSec + 1);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reset quand la durée change (= nouvelle phase)
  useEffect(() => {
    setRemaining(durationSec);
    lastTickRef.current = durationSec + 1;
    completedRef.current = false;
    startTimeRef.current = null;
  }, [durationSec]);

  useEffect(() => {
    if (!active || completedRef.current) return;
    startTimeRef.current = Date.now();
    let raf = 0;

    const tick = () => {
      if (startTimeRef.current === null) return;
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const r = Math.max(0, durationSec - elapsed);
      setRemaining(r);

      const ceil = Math.ceil(r);
      if (withBips && ceil < lastTickRef.current && ceil > 0 && ceil <= 3) {
        BipPlayer.tick();
      }
      lastTickRef.current = ceil;

      if (r <= 0 && !completedRef.current) {
        completedRef.current = true;
        if (withBips) BipPlayer.ding();
        try {
          (navigator as unknown as { vibrate?: (p: number[]) => void }).vibrate?.([200, 100, 200]);
        } catch {
          /* iOS ne supporte pas, c'est attendu */
        }
        onCompleteRef.current?.();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      startTimeRef.current = null;
    };
  }, [active, durationSec, withBips]);

  return { remaining };
}
