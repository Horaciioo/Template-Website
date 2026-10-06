---
name: testing
description: Convention de tests à appliquer dès qu'une bibliothèque de test rejoint un projet (aucune n'est installée par défaut, voir `packages`). Outillage recommandé, ce qui se teste en priorité, emplacement des fichiers. À charger avant d'installer un outil de test ou d'écrire le premier test.
---

# Tests

## Aucun outil de test n'est préinstallé, volontairement

Ce template n'installe rien par anticipation (voir `instructions` et `packages`). Ce skill décrit la convention à suivre **le jour où un projet cloné en a réellement besoin**. Vérifier `package.json` avant d'affirmer qu'un outil de test existe.

## Outillage recommandé, au moment de l'installer

- **Unitaire et composant : Vitest + React Testing Library.** Suivre le guide livré avec la version installée (`node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`) plutôt que la mémoire d'entraînement.
- **De bout en bout : Playwright** (`.../testing/playwright.md`). Un seul outil unitaire et un seul outil e2e : ne pas empiler deux outils qui jouent le même rôle.
- **Non négociable :** Vitest ne gère pas les composants serveur `async`. Une page serveur asynchrone se teste en e2e, jamais en forçant un test unitaire.

## Ce qui se teste en priorité

1. **Fonctions pures** de `utils/` et des services sans état : `NamingService` (dérivations d'identifiants), `FormatService`, `ValidationService`. Meilleur rapport valeur et coût.
2. **Moteur de formulaire** : `FormService.isPayloadValid` contre une déclaration (champs requis manquants, bornes, champs conditionnels).
3. **Routes API publiques** : la chaîne limite par IP, champ piège, validation, envoi. Tester l'enveloppe de `Route` une fois, puis chaque route pour son seul traitement.
4. **États d'un composant de données** : chargement, rempli, vide ne s'affichent jamais deux à la fois.
5. **Parcours e2e** : envoi du formulaire de contact, changement de langue, bascule de thème, consentement cookies (rien de non essentiel avant le choix).

## Ce qui ne se teste pas

- Les registres de `declarations/` et les JSON de `configurations/` : une donnée statique n'a pas de logique à vérifier. Les clés de traduction identiques entre langues se vérifient par script, pas par test de rendu.
- Le rendu d'un composant purement présentationnel : un test qui confirme que le JSX est le JSX casse à chaque refonte sans jamais attraper un bug.

## Emplacement

- **Unitaire et composant : colocation**, `NamingService.test.ts` à côté de `NamingService.ts`, jamais un dossier `__tests__/` qui duplique l'arborescence.
- **e2e : `e2e/` à la racine**, un fichier par parcours utilisateur (`contact.spec.ts`), jamais un fichier par page technique.

## Intégration à la validation

Une fois l'outil installé, ajouter un script `test` et l'intégrer à `yarn validate` et à `.github/workflows/ci.yml`. Des tests qui ne tournent pas dans la validation ne sont que des fichiers qui existent.
