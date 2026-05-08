type Props = {
  onClose: () => void;
};

export function MedicalNotesModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-end"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-slate-800 w-full rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">Notes médicales</h2>
          <button onClick={onClose} className="text-slate-400 text-3xl leading-none -mt-1" aria-label="Fermer">
            ×
          </button>
        </div>
        <div className="space-y-4 text-sm text-slate-200 leading-relaxed">
          <div>
            <div className="font-semibold text-amber-300 mb-1">Contexte</div>
            <p>
              Reprise course après fractures iliopubiennes consolidées. Programme de renforcement progressif
              bassin/core conçu pour stabiliser l'anneau pelvien avant remontée du volume de course.
            </p>
          </div>
          <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3">
            <div className="font-semibold text-red-200 mb-1">⚠ Règle d'arrêt</div>
            <p>
              Toute douleur supérieure à 3/10 sur l'échelle EVA → STOP immédiat. Pas de "no pain no gain"
              sur un anneau pelvien en consolidation.
            </p>
          </div>
          <div>
            <div className="font-semibold mb-1">Progression hebdomadaire</div>
            <p>
              S1-S2 : 9 exercices, charge minimale.
              <br />
              S3-S4 : ajout élastique sur les exos d'activation, augmenter durée des planches.
              <br />
              S5+ : intégrer les sorties course progressives.
            </p>
          </div>
          <div>
            <div className="font-semibold mb-1">Fréquence</div>
            <p>3 à 4 séances par semaine, jamais 2 jours d'affilée si DOMS marquées.</p>
          </div>
          <div>
            <div className="font-semibold mb-1">Ordre bilatéral</div>
            <p>
              Côté droit toujours en premier dans chaque série, puis côté gauche, puis repos.
              Alternance dans la série pour éviter la fatigue unilatérale.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-slate-700 active:bg-slate-600 rounded-xl"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
