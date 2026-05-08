import { useMemo, useState } from 'react';
import type { Exercise } from '../data/exercises';
import { CircularProgress } from './CircularProgress';
import { useTimer } from '../hooks/useTimer';
import { useWakeLock } from '../hooks/useWakeLock';
import { BipPlayer } from './BipPlayer';

type Phase =
  | { kind: 'work'; side?: 'right' | 'left'; setIndex: number; durationSec: number }
  | { kind: 'rest'; setIndex: number; durationSec: number };

function buildPhases(ex: Exercise): Phase[] {
  const phases: Phase[] = [];
  for (let s = 0; s < ex.sets; s++) {
    if (ex.bilateral) {
      phases.push({ kind: 'work', side: 'right', setIndex: s, durationSec: ex.durationSec ?? 0 });
      // Mini repos entre côtés (5s) si la durée travaillée >= 20s, sinon enchaîné
      if ((ex.durationSec ?? 0) >= 20 && ex.restSec > 0) {
        phases.push({ kind: 'rest', setIndex: s, durationSec: 10 });
      }
      phases.push({ kind: 'work', side: 'left', setIndex: s, durationSec: ex.durationSec ?? 0 });
    } else {
      phases.push({ kind: 'work', setIndex: s, durationSec: ex.durationSec ?? 0 });
    }
    if (s < ex.sets - 1 && ex.restSec > 0) {
      phases.push({ kind: 'rest', setIndex: s, durationSec: ex.restSec });
    }
  }
  return phases;
}

type Props = {
  exercise: Exercise;
  onComplete: () => void;
};

export function TimerView({ exercise, onComplete }: Props) {
  const phases = useMemo(() => buildPhases(exercise), [exercise]);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const phase = phases[phaseIdx];

  useWakeLock(running);

  const handlePhaseDone = () => {
    if (phaseIdx + 1 >= phases.length) {
      setRunning(false);
      onComplete();
    } else {
      setPhaseIdx(phaseIdx + 1);
    }
  };

  const { remaining } = useTimer({
    durationSec: phase.durationSec,
    onComplete: handlePhaseDone,
    active: running,
    withBips: true,
  });

  const progress = phase.durationSec > 0 ? 1 - remaining / phase.durationSec : 0;

  let sideLabel: string;
  let bgColor: string;
  let ringColor: string;
  if (phase.kind === 'rest') {
    sideLabel = 'REPOS';
    bgColor = 'bg-amber-500';
    ringColor = '#f59e0b';
  } else if (phase.side === 'right') {
    sideLabel = 'CÔTÉ DROIT';
    bgColor = 'bg-emerald-500';
    ringColor = '#10b981';
  } else if (phase.side === 'left') {
    sideLabel = 'CÔTÉ GAUCHE';
    bgColor = 'bg-blue-500';
    ringColor = '#3b82f6';
  } else {
    sideLabel = 'MAINTIEN';
    bgColor = 'bg-slate-600';
    ringColor = '#64748b';
  }

  const setLabel = `Série ${phase.setIndex + 1}/${exercise.sets}`;
  const phaseInfo = `Phase ${phaseIdx + 1}/${phases.length}`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`w-full text-center py-4 rounded-xl ${bgColor} text-white font-bold text-3xl tracking-wider`}>
        {sideLabel}
      </div>
      <div className="text-slate-400 text-sm">
        {setLabel} · {phaseInfo}
      </div>
      <CircularProgress progress={progress} color={ringColor}>
        <div className="text-7xl font-bold tabular-nums">{Math.ceil(remaining)}</div>
      </CircularProgress>
      <div className="flex gap-3">
        {!running ? (
          <button
            onClick={() => {
              BipPlayer.unlock();
              setRunning(true);
            }}
            className="px-8 py-4 bg-emerald-600 active:bg-emerald-700 rounded-xl font-bold text-xl"
          >
            ▶ {phaseIdx === 0 ? 'Démarrer' : 'Reprendre'}
          </button>
        ) : (
          <button
            onClick={handlePhaseDone}
            className="px-6 py-3 bg-slate-700 active:bg-slate-600 rounded-xl text-base"
          >
            ⏭ Phase suivante
          </button>
        )}
        <button
          onClick={() => {
            setRunning(false);
            onComplete();
          }}
          className="px-4 py-3 bg-slate-700/50 active:bg-slate-700 rounded-xl text-sm text-slate-300"
        >
          Terminer
        </button>
      </div>
    </div>
  );
}
