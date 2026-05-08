import { useMemo, useState } from 'react';
import type { Exercise } from '../data/exercises';
import { CircularProgress } from './CircularProgress';
import { useTimer } from '../hooks/useTimer';
import { useWakeLock } from '../hooks/useWakeLock';
import { BipPlayer } from './BipPlayer';

type WorkPhase = {
  kind: 'work';
  side?: 'right' | 'left';
  setIndex: number;
  reps: number;
  altInRep: boolean;
};
type RestPhase = { kind: 'rest'; setIndex: number; durationSec: number };
type Phase = WorkPhase | RestPhase;

function buildPhases(ex: Exercise): Phase[] {
  const phases: Phase[] = [];
  for (let s = 0; s < ex.sets; s++) {
    if (ex.bilateral && !ex.altInRep) {
      phases.push({ kind: 'work', side: 'right', setIndex: s, reps: ex.reps ?? 0, altInRep: false });
      phases.push({ kind: 'work', side: 'left', setIndex: s, reps: ex.reps ?? 0, altInRep: false });
    } else {
      phases.push({ kind: 'work', setIndex: s, reps: ex.reps ?? 0, altInRep: !!ex.altInRep });
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

export function RepsCounter({ exercise, onComplete }: Props) {
  const phases = useMemo(() => buildPhases(exercise), [exercise]);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = phases[phaseIdx];

  useWakeLock(true);

  const advance = () => {
    if (phaseIdx + 1 >= phases.length) {
      onComplete();
    } else {
      setPhaseIdx(phaseIdx + 1);
    }
  };

  if (phase.kind === 'rest') {
    return <RestPhaseView durationSec={phase.durationSec} onDone={advance} />;
  }

  let sideLabel: string;
  let bgColor: string;
  if (phase.altInRep) {
    sideLabel = 'ALTERNANCE D ↔ G';
    bgColor = 'bg-purple-500';
  } else if (phase.side === 'right') {
    sideLabel = 'CÔTÉ DROIT';
    bgColor = 'bg-emerald-500';
  } else if (phase.side === 'left') {
    sideLabel = 'CÔTÉ GAUCHE';
    bgColor = 'bg-blue-500';
  } else {
    sideLabel = 'EXÉCUTION';
    bgColor = 'bg-slate-600';
  }

  const setLabel = `Série ${phase.setIndex + 1}/${exercise.sets}`;
  const repsLabel = phase.altInRep
    ? `${phase.reps} reps de chaque côté en alternance`
    : `${phase.reps} reps`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`w-full text-center py-4 rounded-xl ${bgColor} text-white font-bold text-3xl tracking-wider`}>
        {sideLabel}
      </div>
      <div className="text-slate-400 text-sm">{setLabel}</div>
      <div className="text-8xl font-bold py-6 tabular-nums">{phase.reps}</div>
      <div className="text-slate-300 text-base">{repsLabel}</div>
      <button
        onClick={() => {
          BipPlayer.unlock();
          BipPlayer.ding();
          advance();
        }}
        className="mt-2 w-full px-10 py-5 bg-emerald-600 active:bg-emerald-700 rounded-xl font-bold text-xl"
      >
        ✓ {phase.altInRep ? 'Série terminée' : 'Côté terminé'}
      </button>
      <button onClick={onComplete} className="text-slate-400 underline text-sm mt-2">
        Terminer maintenant
      </button>
    </div>
  );
}

function RestPhaseView({ durationSec, onDone }: { durationSec: number; onDone: () => void }) {
  const { remaining } = useTimer({
    durationSec,
    onComplete: onDone,
    active: true,
  });
  const progress = 1 - remaining / durationSec;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full text-center py-4 rounded-xl bg-amber-500 text-white font-bold text-3xl tracking-wider">
        REPOS
      </div>
      <CircularProgress progress={progress} color="#f59e0b">
        <div className="text-7xl font-bold tabular-nums">{Math.ceil(remaining)}</div>
      </CircularProgress>
      <button onClick={onDone} className="px-6 py-3 bg-slate-700 active:bg-slate-600 rounded-xl text-base">
        ⏭ Passer le repos
      </button>
    </div>
  );
}
