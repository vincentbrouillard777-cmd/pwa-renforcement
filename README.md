# Renforcement Bassin & Core — PWA

PWA installable sur iPhone pour le programme de renforcement post-fractures iliopubiennes.

## Modes

- **Séance complète** (bouton 🏃 sur l'accueil) — parcours guidé des 9 exercices avec progression, bilan final, sauvegarde dans l'historique.
- **Exercice isolé** (tap sur un exo dans la liste de l'accueil) — pour les créneaux opportunistes (5-10 min en garde). Aucun tracking.

## Lancer en local

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build prod dans ./dist
npm run preview  # tester le build prod localement
```

## Déployer (3 commandes)

Une fois le build vérifié en local :

```bash
# 1. Init Git + push GitHub (la première fois)
git init && git add -A && git commit -m "init"
gh repo create pwa-renforcement --public --source=. --remote=origin --push

# 2. Déployer sur Vercel
npx vercel --prod

# 3. (mises à jour suivantes)
git add -A && git commit -m "msg" && git push
npx vercel --prod
```

Vercel détecte automatiquement Vite et build avec `npm run build`. Le `vercel.json` à la racine gère le rewrite SPA pour que `/exercise/:id` fonctionne au refresh.

Si tu n'as pas `gh` installé : `brew install gh && gh auth login`. Si pas Vercel : `npm i -g vercel && vercel login`.

## Installer la PWA sur iPhone

1. Ouvrir l'URL Vercel dans Safari (PAS Chrome — sur iOS seul Safari installe les PWA).
2. Bouton partage (carré + flèche) → "Sur l'écran d'accueil" → "Ajouter".
3. L'icône RB apparaît sur l'écran d'accueil. Lancée depuis là, l'app s'ouvre plein écran sans la barre Safari.

Le service worker met en cache toute l'app au premier chargement → fonctionne hors-ligne (sauf liens YouTube qui ouvrent le navigateur).

## Notes iOS importantes

- **Vibration : non supportée.** Apple ne donne pas accès à `navigator.vibrate` aux pages web. Les bips audio sont la seule notif sensorielle. Mets le son.
- **Wake Lock : iOS 16.4+.** Sur versions antérieures l'écran peut s'éteindre pendant un timer long. iOS 16.4+ → OK.
- **Audio iOS : déblocage requis.** L'AudioContext est débloqué au premier tap (bouton Démarrer ou tap sur un exo). Si tu n'entends pas les bips, c'est probablement que tu n'as pas tapoté avant.
- **Mise à jour de l'app installée :** `registerType: autoUpdate` recharge le service worker à chaque ouverture si la version a changé. Tu peux pousser des updates et l'iPhone les prend au prochain lancement.

## Structure

```
src/
├── data/exercises.ts        # 9 exercices + URLs YouTube vérifiées
├── store/sessionStore.ts    # Zustand persist (historique seul)
├── hooks/
│   ├── useTimer.ts          # countdown haute précision (Date.now)
│   └── useWakeLock.ts       # garde l'écran allumé
├── components/
│   ├── BipPlayer.ts         # Web Audio singleton (tick + ding)
│   ├── CircularProgress.tsx # anneau SVG
│   ├── TimerView.tsx        # timer pour exos type "time"
│   ├── RepsCounter.tsx      # compteur séries pour exos type "reps"
│   └── ExerciseCard.tsx     # header descriptif
└── pages/
    ├── Home.tsx
    ├── Session.tsx
    ├── ExerciseSolo.tsx
    └── MedicalNotes.tsx     # modale rappel fractures + règle EVA >3
```

## Règle bilatérale (toutes versions)

Pour tous les exos bilatéraux multi-séries (clamshells, side-plank, copenhagen, etc.) : **côté droit en premier dans chaque série, puis côté gauche, puis repos, puis série suivante.** L'UI affiche en gros un bandeau vert "CÔTÉ DROIT" puis bleu "CÔTÉ GAUCHE" pour ne jamais confondre.

Exception : bird-dog et dead-bug ont l'alternance D↔G dans la rep elle-même (mécanique du mouvement) → bandeau violet "ALTERNANCE D ↔ G", un seul bouton par série.

## Modifier un exercice

Tout est dans `src/data/exercises.ts`. Changer une durée, une répétition, ajouter un exo, swap une vidéo : édite ce fichier, `npm run build`, redéploie.
