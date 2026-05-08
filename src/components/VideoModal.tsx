import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

type Props = {
  src: string;
  title: string;
  onClose: () => void;
};

export function VideoModal({ src, title, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Play on mount (best-effort; iOS requires playsinline + may need user gesture)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      /* autoplay blocked, user can tap play */
    });
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        // Respecte le notch / Dynamic Island en haut, et le home indicator en bas
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {/* Header avec titre + X plus gros, sous l'encoche */}
      <div className="flex justify-between items-center px-4 py-3 text-white">
        <div className="text-base font-semibold truncate flex-1 pr-3">{title}</div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-12 h-12 -mr-2 flex items-center justify-center rounded-full bg-slate-800/80 active:bg-slate-700 text-white tap-highlight-none"
          aria-label="Fermer la vidéo"
        >
          <X size={28} strokeWidth={2.5} />
        </button>
      </div>

      {/* Vidéo : tap dessus n'enclenche pas la fermeture */}
      <div
        className="flex-1 flex items-center justify-center px-2"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          ref={videoRef}
          src={src}
          controls
          playsInline
          loop
          className="w-full max-h-full bg-black rounded-lg"
        />
      </div>

      {/* Gros bouton Fermer en bas, accessible au pouce */}
      <div className="px-4 pb-4 pt-3" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="w-full py-4 bg-slate-700 active:bg-slate-600 text-white rounded-xl font-semibold text-lg tap-highlight-none"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
