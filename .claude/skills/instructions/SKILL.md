---
name: instructions
description: Instructions de développement du template de site. À charger au démarrage de toute tâche sur ce dépôt. Décrit ce qu'est ce projet, ce qui a le droit d'y être écrit, la stack, et la checklist de livraison.
---

# Instructions de développement — Template de site

## 1. Ce qu'est ce dépôt

Une **base réutilisable** pour démarrer un site vitrine, pas un site pour un client donné. Chaque chose écrite ici sera reprise telle quelle dans les projets suivants. La question à se poser avant chaque ligne : _est-ce que ça marchera aussi pour le prochain projet, qui n'a rien à voir ?_

Si la réponse est non, la ligne n'a pas sa place ici.

## 2. Ce qui est interdit dans ce dépôt

- **Un nom de client, de marque, de personne, de ville.** Les valeurs de `configurations/` sont des
  exemples neutres, elles se remplacent projet par projet.
- **Un vocabulaire métier.** Pas de `Coach`, `Salon`, `Prestation`, `Galerie`. On écrit `Offer`,
  `Feature`, `Media`, `Testimonial`.
- **Une phrase dans un `.tsx`.** Tout ce qu'un visiteur lit vit dans `messages/<locale>.json`.
- **Une couleur, un rayon, une durée écrits en dur.** Ils viennent de `configurations/theme.json` via
  les variantes.
- **Un chemin d'URL écrit à la main.** Il vient de `NavigationService.pathOf`.
- **Un dossier `hooks/`, `lib/` ou `config/`.** Voir `guide/ARBORESCENCE.md`.

## 3. Stack

- Next.js App Router, React 19, TypeScript strict
- Tailwind CSS 3, la palette étant générée depuis `configurations/theme.json`
- `next-intl` pour les langues et le routage localisé
- `lucide-react` derrière le registre `ICONS`, jamais importé directement par un composant
- `clsx` + `tailwind-merge` derrière `cn()`
- `zod` disponible pour un besoin de schéma qui dépasserait `ValidationService`
- `@vercel/analytics`, branché uniquement si le drapeau et la variable d'environnement l'autorisent

Aucune dépendance ajoutée sans besoin concret. Vérifier d'abord le skill `packages`.

## 4. Composants serveur et composants client

Serveur par défaut. `'use client'` uniquement pour un état, un écouteur d'événement, un portail ou un
service à état (`ScrollService`, `ViewportService`, `NotificationService`).

Piège connu : un module importé par un composant serveur ne doit pas, même indirectement, importer
un hook React. C'est pour cette raison que `ThemeService` est sans état — le layout serveur l'appelle
pour injecter la feuille de style du thème.

## 5. Ordre de travail pour une demande

1. Lire `guide/REGISTRE.md` : la brique existe-t-elle déjà ?
2. Lire le skill `conventions` : comment ça doit s'appeler ?
3. Déclarer la donnée dans `configurations/`, `declarations/` ou `messages/`.
4. Écrire ou étendre le service.
5. Écrire le composant, qui ne fait que rendre.
6. Ajouter la brique à l'atlas si elle est visuelle, **en lisant son registre**.
7. Écrire son entrée dans `guide/REGISTRE.md`.
8. Mettre à jour le skill concerné si une règle a changé.

Les étapes 6, 7 et 8 ne sont pas optionnelles : une brique non recensée est réécrite au projet suivant.

## 6. Accessibilité, non négociable

- Un bouton sans texte porte un `aria-label` traduit — c'est pourquoi `IconButton` rend `label`
  obligatoire.
- Une image porte un `alt` traduit ; une image décorative passe une chaîne vide, elle ne l'omet pas.
- Un champ est toujours relié à son `<label>` par un `id` construit avec `NamingService.toDomId`.
- Une erreur de formulaire porte `role="alert"` et est référencée par `aria-describedby`.
- Le focus reste visible : `FOCUS_RING` est appliqué par les variantes, on ne l'enlève jamais.
- Les animations respectent `prefers-reduced-motion`, déjà géré dans `globals.css`.

## 7. Checklist avant de rendre du travail

```bash
yarn type-check && yarn lint && yarn build
```

Les trois doivent être verts. Puis :

- [ ] aucune phrase visible dans un `.tsx`
- [ ] aucune couleur ni URL en dur
- [ ] les deux fichiers de `messages/` ont exactement les mêmes clés
- [ ] la nouveauté apparaît dans `/showcase` si elle est visuelle
- [ ] `guide/REGISTRE.md` est à jour
- [ ] testé en mobile d'abord, puis en thème clair **et** en thème sombre
