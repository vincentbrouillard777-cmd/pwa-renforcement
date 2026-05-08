import { Link, useNavigate } from 'react-router-dom';
import { Video } from 'lucide-react';
import { useState } from 'react';
import { EXERCISES, BLOCS } from '../data/exercises';
import type { Exercise } from '../data/exercises';
import { useSessionStore } from '../store/sessionStore';
import { BipPlayer } from '../components/BipPlayer';
import { VideoModal } from '../components/VideoModal';
import { MedicalNotesModal } from './MedicalNotes';

export function Home() {
  const navigate = useNavigate();
  const startSession = useSessionStore((s) => s.startSession);
  const [showNotes, setShowNotes] = useState(false);
  const [videoFor, setVideoFor] = useState<Exercise | null>(null);

  const handleStart = () => {
    BipPlayer.unlock();
    startSession();
    navigate('/session');
  };

  return (
    <div className="min-h-screen p-4 pb-12 max-w-md mx-auto">
      <header className="pt-4 pb-6">
        <h1 className="text-3xl font-bold text-center leading-tight">
          Renforcement
          <br />
          Bassin & Core
        </h1>
      </header>

      <button
        onClick={handleStart}
        className="w-full bg-emerald-600 active:bg-emerald-700 rounded-2xl p-6 flex flex-col items-center gap-2 shadow-lg"
      >
        <div className="text-4xl">🏃</div>
        <div className="font-bold text-xl">Démarrer une séance complète</div>
        <div className="text-sm text-emerald-100">9 exercices · 20-25 min</div>
      </button>

      <div className="mt-8 mb-3 text-center text-slate-400 text-sm">ou un exercice isolé</div>

      {BLOCS.map((bloc) => (
        <section key={bloc.key} className="mb-6">
          <h2 className="text-xs uppercase tracking-wider text-slate-400 mb-2 px-1">
            Bloc {bloc.key} — {bloc.name}
          </h2>
          <div className="space-y-1">
            {EXERCISES.filter((e) => e.bloc === bloc.key).map((ex) => (
              <div key={ex.id} className="flex items-stretch gap-2">
                <Link
                  to={`/exercise/${ex.id}`}
                  onClick={() => BipPlayer.unlock()}
                  className="flex-1 bg-slate-800 active:bg-slate-700 rounded-xl p-3 tap-highlight-none"
                >
                  <div className="font-semibold">{ex.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{ex.target}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {ex.type === 'time'
                      ? `${ex.sets}× ${ex.durationSec}s${ex.bilateral ? ' /côté' : ''}`
                      : `${ex.sets}× ${ex.reps}${ex.bilateral ? ' /côté' : ''}`}
                  </div>
                </Link>
                <button
                  onClick={() => setVideoFor(ex)}
                  className="px-3 flex items-center bg-slate-800 active:bg-slate-700 rounded-xl text-emerald-400 tap-highlight-none"
                  aria-label="Voir la vidéo"
                >
                  <Video size={20} />
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}

      <footer className="text-center mt-10 text-xs text-slate-500">
        <button onClick={() => setShowNotes(true)} className="underline">
          v1.0 · Notes médicales
        </button>
      </footer>

      {showNotes && <MedicalNotesModal onClose={() => setShowNotes(false)} />}
      {videoFor && (
        <VideoModal
          src={videoFor.localVideoUrl}
          title={videoFor.name}
          onClose={() => setVideoFor(null)}
        />
      )}
    </div>
  );
}
