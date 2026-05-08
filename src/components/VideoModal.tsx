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
      className="fixed inset-0 z-50 bg-black/90 flex flex-col"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex justify-between items-center p-3 text-white">
        <div className="text-sm font-semibold truncate flex-1 pr-2">{title}</div>
        <button
          onClick={onClose}
          className="p-2 -m-2 text-slate-300 active:text-white"
          aria-label="Fermer"
        >
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <video
          ref={videoRef}
          src={src}
          controls
          playsInline
          loop
          className="w-full max-h-full bg-black"
        />
      </div>
    </div>
  );
}
