import { Navigate, useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { EXERCISE_BY_ID } from '../data/exercises';
import { ExerciseCard } from '../components/ExerciseCard';
import { TimerView } from '../components/TimerView';
import { RepsCounter } from '../components/RepsCounter';

export function ExerciseSolo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ex = id ? EXERCISE_BY_ID[id] : null;
  const [done, setDone] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  if (!ex) return <Navigate to="/" replace />;

  if (done) {
    return (
      <div className="min-h-screen p-4 max-w-md mx-auto flex flex-col items-center justify-center text-center">
        <div className="text-7xl mb-4">💪</div>
        <h1 className="text-3xl font-bold mb-2">Bien joué</h1>
        <div className="text-slate-300 mb-8">{ex.name}</div>
        <div className="flex gap-3 w-full">
          <button
            onClick={() => {
              setDone(false);
              setResetKey((k) => k + 1);
            }}
            className="flex-1 py-3 bg-slate-700 active:bg-slate-600 rounded-xl"
          >
            Refaire
          </button>
          <Link
            to="/"
            className="flex-1 py-3 bg-emerald-600 active:bg-emerald-700 rounded-xl text-center font-semibold"
          >
            Retour
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-8 max-w-md mx-auto">
      <header className="mb-4">
        <button onClick={() => navigate('/')} className="text-slate-400 flex items-center gap-1 p-2">
          <ChevronLeft size={18} /> Accueil
        </button>
      </header>
      <ExerciseCard exercise={ex} />
      <div className="my-6">
        {ex.type === 'time' ? (
          <TimerView key={resetKey} exercise={ex} onComplete={() => setDone(true)} />
        ) : (
          <RepsCounter key={resetKey} exercise={ex} onComplete={() => setDone(true)} />
        )}
      </div>
    </div>
  );
}
