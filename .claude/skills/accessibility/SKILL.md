---
name: accessibility
description: Checklist d'accessibilité clavier, lecteur d'écran et contraste pour les composants du template et tout composant dérivé (formulaires, navigation, superpositions, états vides). À charger avant de livrer un composant interactif, ou pour traiter le point RGAA / WCAG d'un projet client (voir `delivery-checklist`).
---

# Accessibilité

Les règles minimales sont dans `instructions` (section 6). Ce skill est la grille complète à rejouer avant de livrer un composant interactif.

## Le lint ne couvre pas ce travail

`yarn lint` ne contient pas de règles d'accessibilité JSX dédiées : ni `jsx-a11y`, ni équivalent. Un lint vert ne dit rien d'un composant accessible, la relecture se fait à la main avec cette grille.

## Clavier, avant tout le reste

- Tout élément interactif (`Button`, `IconButton`, `ActionLink`, `Tabs`, `Accordion`, `Pagination`, commutateurs de thème et de langue) atteignable à `Tab` et activable au clavier, sans `onClick` posé sur un `<div>`.
- Focus visible en permanence : `FOCUS_RING` (`declarations/ui/tokens.ts`) est appliqué par les variantes, jamais d'`outline: none` sans remplacement au moins aussi visible.
- Ordre de tabulation qui suit l'ordre visuel, jamais de `tabIndex` positif.
- `Modal` et `Drawer` piègent le focus tant qu'ils sont ouverts, se ferment à `Échap` et le rendent au déclencheur.
- Un lien « aller au contenu » en tête de page si l'en-tête compte beaucoup de liens.

## Formulaires

- Chaque champ rendu par `FormRenderer` produit un `<label>` réellement associé (`htmlFor` et `id` via `NamingService.toDomId`), jamais un placeholder en guise de label.
- Un champ en erreur porte `aria-invalid` et un message lié par `aria-describedby`, avec `role="alert"`. L'erreur ne tient pas à la couleur seule.
- Un champ masqué par une condition est retiré du DOM, pas seulement caché visuellement.
- Le `HoneypotField` est hors écran **et** hors tabulation **et** `aria-hidden`.

## États, feedback, motion

- `Skeleton` et `PageSkeleton` sont décoratifs : `aria-hidden="true"`.
- `EmptyState` : l'action reste un vrai `<button>` ou `<a>`, jamais un texte stylé.
- `Alert` et `NotificationRegion` annoncent par `role` adapté (`alert` ou `status`), pas par la couleur.
- `prefers-reduced-motion` coupe toute animation, y compris celles ajoutées plus tard (voir `globals.css`).

## Contraste et couleur

- Aucune information (erreur, statut, obligatoire) portée par la couleur seule.
- Chaque paire texte et fond de `theme.json`, en clair **et** en sombre, passe WCAG AA (4,5:1 le texte, 3:1 le grand texte et les composants). Mesurer avec `python3 .claude/skills/ai-tells/scripts/contrast.py "#texte" "#fond1" "#fond2"` (couleurs en hexadécimal, les canaux RVB de `theme.json` sont à convertir) plutôt que d'estimer à l'œil.
- La palette change avec chaque client : rejouer la mesure sur chaque token de texte d'un projet cloné.

## Structure et sémantique

- Un seul `h1` par page, hiérarchie de titres continue (même règle que `seo`).
- Landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`) dans `SiteLayout`, pas une forêt de `<div>`.
- Image porteuse de sens : `alt` traduit descriptif. Image décorative : `alt=""`, jamais omis.
- `lang` de `<html>` suit la langue courante, les passages dans une autre langue portent leur `lang`.
- Un lien dit où il va (`aria-label` traduit si le texte seul ne suffit pas), jamais « cliquez ici ».

## Avant de livrer

Parcourir le parcours principal **au clavier seul**, puis au lecteur d'écran (VoiceOver : `Cmd + F5`) sur la page d'accueil et le formulaire. Les deux sont non négociables avant de cocher le point correspondant de `delivery-checklist`.
