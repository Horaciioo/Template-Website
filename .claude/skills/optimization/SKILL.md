---
name: optimization
description: Leviers d'optimisation performance du template de site, lazy loading, CSS, JavaScript, polices, scripts tiers, images, Core Web Vitals. À charger avant d'ajouter une image, un composant lourd, un script tiers, ou pour faire remonter un score PageSpeed sous 80 (voir `delivery-checklist`).
---

# Optimisation performance

C'est le **comment** derrière l'exigence « PageSpeed ≥ 80 » de `delivery-checklist`. Vérifier toute API de Next.js citée ici contre `node_modules/next/dist/docs/` avant de l'utiliser : la version installée peut différer de la mémoire d'entraînement.

## Images

- Toujours `next/image` (via `Picture`), jamais `<img>` brut. Formats modernes (AVIF, WebP) servis automatiquement, ne pas les contourner.
- `priority` **uniquement** sur l'image visible au premier écran (LCP), jamais par défaut.
- Dimensionner à la taille réellement affichée, pas une source démesurée réduite côté client.
- Réserver l'espace (`width` et `height`, ou `fill` dans un conteneur dimensionné) pour éviter le décalage de mise en page (CLS).
- Ne jamais charger en différé un élément visible dès l'ouverture : le LCP se dégrade au lieu de s'améliorer.

## Polices

- `next/font` exclusivement, via `declarations/ui/fonts.ts` : polices auto-hébergées au build, aucune requête externe, aucun saut de mise en page.
- Deux familles au plus, et seulement les graisses réellement utilisées.

## JavaScript

- Composants serveur par défaut. `'use client'` seulement au niveau du composant qui a besoin d'un état, d'un effet ou d'un événement, jamais en tête d'un parent par confort : chaque `'use client'` alourdit le paquet envoyé.
- `next/dynamic` pour tout composant lourd et non visible immédiatement (carte `LocationMap`, modale complexe, contenu d'un onglet inactif).
- Pas d'import d'une bibliothèque entière pour une fonction. Une fonction locale vaut mieux qu'une dépendance pour un besoin trivial (skill `packages`).
- `yarn build` affiche le poids par route : le relire à chaque changement de dépendance.

## CSS

- Tailwind émet déjà un CSS purgé et minifié au build : aucune étape de minification en plus.
- Pas de style inline recalculé à chaque rendu pour une valeur qui pourrait être une classe statique.
- Pas de CSS mort : un jeton ajouté et jamais consommé se supprime.

## Scripts tiers

- `next/script` (ou `@next/third-parties`), jamais un `<script>` brut dans le JSX.
- Stratégie selon la criticité : `afterInteractive` pour l'analytics, une fois le consentement acquis (`AnalyticsGate`) ; `lazyOnload` pour tout ce qui n'est pas critique (chat, widget) ; `beforeInteractive` réservé à ce qui est nécessaire avant l'hydratation.
- Tout nouveau tiers suit aussi `security` : CSP, politique de confidentialité, consentement.

## Core Web Vitals

- **LCP** : l'élément principal du premier écran arrive vite (image prioritaire, police préchargée par `next/font`).
- **CLS** : espace réservé pour images, polices, bannière de consentement et contenu injecté ; les squelettes (`Skeleton`, `PageSkeleton`) occupent l'espace final.
- **INP** : aucun calcul lourd dans un gestionnaire de clic ou de saisie.

## Réseau et cache

- Laisser Next.js gérer compression et cache statique, ne pas les désactiver sans raison écrite.
- Statique quand c'est possible : une page dont le contenu ne change pas à chaque requête ne se rend pas dynamiquement.

## Vérifier le résultat

```bash
yarn build
```

Lire la sortie, puis mesurer sur PageSpeed Insights (voir `delivery-checklist`). Un `yarn build` propre ne prouve pas un score.
