export type ExerciseType = 'reps' | 'time';

export type Exercise = {
  id: string;
  bloc: 'A' | 'B' | 'C' | 'D';
  blocName: string;
  name: string;
  target: string;
  type: ExerciseType;
  sets: number;
  reps?: number;
  bilateral: boolean;
  durationSec?: number;
  restSec: number;
  description: string;
  /** URL YouTube source (lien externe, ouvre dans le navigateur). */
  videoUrl: string;
  /** Chemin de la vidéo locale auto-hébergée (servi depuis /videos/...). */
  localVideoUrl: string;
  keyTip?: string;
  /**
   * Pour les exercices `reps` bilatéraux dont l'alternance D/G se fait
   * AU SEIN d'une rep (pas en blocs séparés). Ex: bird-dog, dead-bug.
   * Si true → pas de label de côté pendant le compteur.
   */
  altInRep?: boolean;
};

export const EXERCISES: Exercise[] = [
  // BLOC A — Activation moyen fessier
  {
    id: 'clamshells',
    bloc: 'A',
    blocName: 'Activation moyen fessier',
    name: 'Clamshells (coquillage)',
    target: 'Moyen fessier',
    type: 'reps',
    sets: 3,
    reps: 15,
    bilateral: true,
    restSec: 30,
    description:
      "Couché sur le côté, genoux fléchis 90°, pieds joints. Ouvrir le genou supérieur sans basculer le bassin.",
    videoUrl: 'https://www.youtube.com/watch?v=aQVApsdOLSI',
    localVideoUrl: '/videos/clamshells.mp4',
    keyTip: 'Progression S3-S4 : élastique autour des genoux',
  },
  {
    id: 'single-leg-bridge',
    bloc: 'A',
    blocName: 'Activation moyen fessier',
    name: 'Pont unipodal',
    target: 'Fessier + stabilité bassin',
    type: 'reps',
    sets: 3,
    reps: 10,
    bilateral: true,
    restSec: 30,
    description:
      "Dos au sol, un pied au sol, l'autre jambe tendue en l'air. Monter les hanches en contractant le fessier du pied d'appui.",
    videoUrl: 'https://www.youtube.com/watch?v=7vTnfE6oiXk',
    localVideoUrl: '/videos/single-leg-bridge.mp4',
    keyTip: 'Hanches alignées, ne pas basculer',
  },

  // BLOC B — Stabilité lombo-pelvienne
  {
    id: 'side-plank',
    bloc: 'B',
    blocName: 'Stabilité lombo-pelvienne',
    name: 'Planche latérale',
    target: 'Moyen fessier + transverse',
    type: 'time',
    sets: 3,
    bilateral: true,
    durationSec: 30,
    restSec: 30,
    description:
      "Sur l'avant-bras, corps aligné, hanches hautes, pas d'affaissement.",
    videoUrl: 'https://www.youtube.com/watch?v=44ND4bOB-T0',
    localVideoUrl: '/videos/side-plank.mp4',
    keyTip: 'Exercice phare. Progression 30→45→60 sec.',
  },
  {
    id: 'bird-dog',
    bloc: 'B',
    blocName: 'Stabilité lombo-pelvienne',
    name: 'Bird-dog',
    target: 'Coordination core/bassin',
    type: 'reps',
    sets: 3,
    reps: 10,
    bilateral: true,
    altInRep: true,
    restSec: 30,
    description:
      "À quatre pattes, tendre bras droit + jambe gauche simultanément, garder le dos stable, puis alterner. Compte 10 reps de chaque côté en alternance.",
    videoUrl: 'https://www.youtube.com/watch?v=ee5DVxN_Tfw',
    localVideoUrl: '/videos/bird-dog.mp4',
    keyTip: 'Lent, contrôlé. Pas de basculement du bassin.',
  },
  {
    id: 'dead-bug',
    bloc: 'B',
    blocName: 'Stabilité lombo-pelvienne',
    name: 'Dead bug',
    target: 'Transverse',
    type: 'reps',
    sets: 3,
    reps: 10,
    bilateral: true,
    altInRep: true,
    restSec: 30,
    description:
      "Dos au sol, bras tendus au plafond, genoux à 90°. Descendre bras droit + jambe gauche (opposés) sans creuser le bas du dos. Alterne 10 reps de chaque côté.",
    videoUrl: 'https://www.youtube.com/watch?v=bxn9FBrt4-A',
    localVideoUrl: '/videos/dead-bug.mp4',
    keyTip: 'Clé anti-fracture : transverse stabilise le bassin.',
  },

  // BLOC C — Spécifique coureur
  {
    id: 'copenhagen-plank',
    bloc: 'C',
    blocName: 'Spécifique coureur',
    name: 'Copenhagen plank',
    target: 'Adducteurs',
    type: 'time',
    sets: 3,
    bilateral: true,
    durationSec: 20,
    restSec: 45,
    description:
      "Side plank avec la jambe supérieure en appui sur un banc/chaise, jambe inférieure levée.",
    videoUrl: 'https://www.youtube.com/watch?v=48wlc5zn02A',
    localVideoUrl: '/videos/copenhagen-plank.mp4',
    keyTip: 'Adducteurs = symphyse pubienne. Crucial pour anneau pelvien.',
  },
  {
    id: 'step-up',
    bloc: 'C',
    blocName: 'Spécifique coureur',
    name: 'Montées de banc lentes',
    target: 'Quadri + fessier + stabilité',
    type: 'reps',
    sets: 3,
    reps: 10,
    bilateral: true,
    restSec: 45,
    description:
      "Sur un step/escalier de 30-40 cm, monter lentement sur une jambe, contrôler la descente.",
    videoUrl: 'https://www.youtube.com/watch?v=k_0Ul3prWAc',
    localVideoUrl: '/videos/step-up.mp4',
    keyTip: 'La descente excentrique est la phase qui compte.',
  },

  // BLOC D — Mobilité
  {
    id: 'pigeon-pose',
    bloc: 'D',
    blocName: 'Mobilité',
    name: 'Pigeon pose',
    target: 'Ischio-psoas',
    type: 'time',
    sets: 1,
    bilateral: true,
    durationSec: 60,
    restSec: 0,
    description: 'Étirement du yoga, relâche les tensions pelviennes.',
    videoUrl: 'https://www.youtube.com/watch?v=0_zPqA65Nok',
    localVideoUrl: '/videos/pigeon-pose.mp4',
  },
  {
    id: 'happy-baby',
    bloc: 'D',
    blocName: 'Mobilité',
    name: 'Happy baby',
    target: 'Plancher pelvien',
    type: 'time',
    sets: 1,
    bilateral: false,
    durationSec: 30,
    restSec: 0,
    description:
      "Dos au sol, genoux vers les aisselles, mains aux pieds. Relâche le plancher pelvien.",
    videoUrl: 'https://www.youtube.com/watch?v=DsuQQMzFU-4',
    localVideoUrl: '/videos/happy-baby.mp4',
  },
];

export const EXERCISE_BY_ID: Record<string, Exercise> = Object.fromEntries(
  EXERCISES.map((e) => [e.id, e])
);

export const BLOCS: Array<{ key: 'A' | 'B' | 'C' | 'D'; name: string }> = [
  { key: 'A', name: 'Activation moyen fessier' },
  { key: 'B', name: 'Stabilité lombo-pelvienne' },
  { key: 'C', name: 'Spécifique coureur' },
  { key: 'D', name: 'Mobilité' },
];
