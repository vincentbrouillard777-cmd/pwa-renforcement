import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { EXERCISES } from '../data/exercises';
import { useSessionStore } from '../store/sessionStore';
import { ExerciseCard } from '../components/ExerciseCard';
import { TimerView } from '../components/TimerView';
import { RepsCounter } from '../components/RepsCounter';

export function Session() {
  const navigate = useNavigate();
  const active = useSessionStore((s) => s.active);
  const currentIndex = useSessionStore((s) => s.currentIndex);
  const completedIds = useSessionStore((s) => s.completedIds);
  const startedAt = useSessionStore((s) => s.startedAt);
  const completeCurrent = useSessionStore((s) => s.completeCurrent);
  const skipCurrent = useSessionStore((s) => s.skipCurrent);
  const goToPrevious = useSessionStore((s) => s.goToPrevious);
  const endSession = useSessionStore((s) => s.endSession);
  const abandonSession = useSessionStore((s) => s.abandonSession);

  const [confirmExit, setConfirmExit] = useState(false);

  if (!active) {
    return <Navigate to="/" replace />;
  }

  if (currentIndex >= EXERCISES.length) {
    return (
      <SessionRecap
        completedIds={completedIds}
        startedAt={startedAt}
        onDone={() => {
          endSession();
          navigate('/');
        }}
      />
    );
  }

  const ex = EXERCISES[currentIndex];
  const blocCount = EXERCISES.filter((e) => e.bloc === ex.bloc).length;
  const blocPosition = EXERCISES.filter((e, i) => e.bloc === ex.bloc && i <= currentIndex).length;

  return (
    <div className="min-h-screen p-4 pb-8 max-w-md mx-auto">
      <header className="flex items-center justify-between mb-3">
        <div className="text-sm text-slate-400">
          Exercice {currentIndex + 1}/{EXERCISES.length} · Bloc {ex.bloc} ({blocPosition}/{blocCount})
        </div>
        <button onClick={() => setConfirmExit(true)} className="text-slate-400 p-2" aria-label="Quitter">
          <X size={20} />
        </button>
      </header>

      <div className="bg-slate-800/50 h-1.5 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-emerald-500 h-full transition-all"
          style={{ width: `${((currentIndex + 1) / EXERCISES.length) * 100}%` }}
        />
      </div>

      <ExerciseCard exercise={ex} />

      <div className="my-6">
        {ex.type === 'time' ? (
          <TimerView key={ex.id} exercise={ex} onComplete={completeCurrent} />
        ) : (
          <RepsCounter key={ex.id} exercise={ex} onComplete={completeCurrent} />
        )}
      </div>

      <footer className="flex gap-2 mt-8">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="flex-1 py-3 bg-slate-800 active:bg-slate-700 rounded-xl disabled:opacity-30 text-sm"
        >
          <ChevronLeft size={16} className="inline" /> Précédent
        </button>
        <button
          onClick={skipCurrent}
          className="flex-1 py-3 bg-slate-800 active:bg-slate-700 rounded-xl text-slate-400 text-sm"
        >
          Skip
        </button>
        <button
          onClick={completeCurrent}
          className="flex-1 py-3 bg-emerald-700 active:bg-emerald-800 rounded-xl text-sm font-semibold"
        >
          Suivant →
        </button>
      </footer>

      {confirmExit && (
        <ExitModal
          onCancel={() => setConfirmExit(false)}
          onSavePartial={() => {
            endSession();
            navigate('/');
          }}
          onAbandon={() => {
            abandonSession();
            navigate('/');
          }}
        />
      )}
    </div>
  );
}

function ExitModal({
  onCancel,
  onSavePartial,
  onAbandon,
}: {
  onCancel: () => void;
  onSavePartial: () => void;
  onAbandon: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm">
        <h3 className="text-xl font-bold mb-2">Quitter la séance ?</h3>
        <p className="text-sm text-slate-300 mb-6">
          Tu peux sauvegarder ce qui est fait dans l'historique, ou abandonner sans trace.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onSavePartial}
            className="py-3 bg-emerald-700 active:bg-emerald-800 rounded-xl"
          >
            Sauvegarder ce qui est fait
          </button>
          <button onClick={onAbandon} className="py-3 bg-red-900 active:bg-red-950 rounded-xl">
            Abandonner sans trace
          </button>
          <button onClick={onCancel} className="py-3 bg-slate-700 active:bg-slate-600 rounded-xl">
            Continuer la séance
          </button>
        </div>
      </div>
    </div>
  );
}

function SessionRecap({
  completedIds,
  startedAt,
  onDone,
}: {
  completedIds: string[];
  startedAt: number | null;
  onDone: () => void;
}) {
  const durationMin = startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 60000)) : 0;
  const skipped = EXERCISES.filter((e) => !completedIds.includes(e.id));

  return (
    <div className="min-h-screen p-4 max-w-md mx-auto flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="text-7xl mb-4">🎯</div>
        <h1 className="text-3xl font-bold mb-2">Séance terminée</h1>
        <div className="text-slate-300 mb-8">{durationMin} minutes</div>

        <div className="bg-slate-800 rounded-xl p-4 w-full text-left">
          <div className="text-sm text-slate-400 mb-1">Bilan</div>
          <div className="text-2xl font-bold mb-2">
            {completedIds.length}/{EXERCISES.length} exercices faits
          </div>
          {skipped.length > 0 && (
            <div className="text-xs text-amber-300 mt-3 leading-relaxed">
              Skippés : {skipped.map((e) => e.name).join(', ')}
            </div>
          )}
        </div>
      </div>
      <button
        onClick={onDone}
        className="w-full py-4 bg-emerald-600 active:bg-emerald-700 rounded-xl font-bold text-lg mt-8"
      >
        Retour à l'accueil
      </button>
    </div>
  );
}
