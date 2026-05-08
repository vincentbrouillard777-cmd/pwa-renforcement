import type { Exercise } from '../data/exercises';
import { Play, ExternalLink } from 'lucide-react';

type Props = {
  exercise: Exercise;
  showVideoButton?: boolean;
};

export function ExerciseCard({ exercise, showVideoButton = true }: Props) {
  const dosage =
    exercise.type === 'time'
      ? `${exercise.sets}× ${exercise.durationSec}s${exercise.bilateral ? ' chaque côté' : ''} · repos ${exercise.restSec}s`
      : `${exercise.sets}× ${exercise.reps} reps${
          exercise.bilateral ? (exercise.altInRep ? ' (alternés)' : ' chaque côté') : ''
        } · repos ${exercise.restSec}s`;

  return (
    <div className="space-y-3">
      <div>
        <div className="text-xs uppercase tracking-wider text-slate-400">
          Bloc {exercise.bloc} · {exercise.blocName}
        </div>
        <h2 className="text-2xl font-bold mt-1">{exercise.name}</h2>
        <div className="text-sm text-slate-400">{exercise.target}</div>
      </div>
      <div className="text-sm text-slate-300 leading-relaxed">{exercise.description}</div>
      {exercise.keyTip && (
        <div className="text-sm bg-amber-900/30 border border-amber-700/40 text-amber-200 rounded-lg p-3">
          💡 {exercise.keyTip}
        </div>
      )}
      <div className="text-sm text-slate-200 font-medium">{dosage}</div>
      {showVideoButton && (
        <a
          href={exercise.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-emerald-300 underline"
        >
          <Play size={16} /> Voir la vidéo <ExternalLink size={14} />
        </a>
      )}
    </div>
  );
}
