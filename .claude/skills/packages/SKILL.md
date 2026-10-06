---
name: packages
description: Dépendances réellement installées dans le template et bibliothèques admises pour un besoin ponctuel. À charger AVANT d'ajouter un package, pour réutiliser l'existant au lieu d'installer un doublon.
---

# Packages

## Ce qui est déjà installé

| Package                       | Ce qu'il porte dans le dépôt                            | Passe par                           |
| ----------------------------- | ------------------------------------------------------- | ----------------------------------- |
| `next`                        | App Router, images, métadonnées, sitemap, robots        | —                                   |
| `react`, `react-dom`          | Rendu                                                   | —                                   |
| `next-intl`                   | Langues, routage localisé, formatage ICU                | `I18nService`, `@/i18n/routing`     |
| `tailwindcss`                 | Toutes les classes, la palette venant de `theme.json`   | `declarations/ui`                   |
| `lucide-react`                | Les glyphes (sans logos de marques depuis la 1.x)       | `ICONS`, `Icon`                     |
| `clsx` + `tailwind-merge`     | Fusion de classes                                       | `cn()`                              |
| `zod`                         | Schémas, pour un besoin qui dépasse `ValidationService` | —                                   |
| `@vercel/analytics`           | Envoi d'événements                                      | `AnalyticsService`                  |
| `@next/third-parties`         | Chargement optimisé de Google Analytics (GA4)           | `GoogleAnalytics` dans `layout.tsx` |
| `prettier` + plugin Tailwind  | Format, ordre des classes                               | `yarn format`                       |
| `eslint`, `typescript-eslint` | Règles, dont `no-explicit-any` en erreur                | `yarn lint`                         |

**Un composant n'importe jamais `lucide-react`, `clsx` ni `tailwind-merge` directement.** Il passe par `Icon` et `cn`. C'est ce qui permet de changer de librairie d'icônes en éditant un seul fichier.

## Bibliothèques admises si le besoin est réel

À n'installer que quand la demande l'exige vraiment, et à recenser dans `guide/REGISTRE.md` :

| Besoin                              | Package retenu                                |
| ----------------------------------- | --------------------------------------------- |
| Composants interactifs accessibles  | `@headlessui/react`                           |
| Animation complexe, chronologie     | `gsap`                                        |
| Animation vectorielle exportée      | `lottie-react`                                |
| État global dépassant `createStore` | `zustand`                                     |
| Cache de données distantes          | `@tanstack/react-query`                       |
| Base de données                     | `@prisma/client`                              |
| Supervision d'erreurs               | `@sentry/nextjs`                              |
| Hachage de mot de passe             | `bcryptjs`                                    |
| Courriel transactionnel             | appel HTTP direct via `MailService`, sans SDK |

## Avant d'installer quoi que ce soit

1. Vérifier que le besoin n'est pas déjà couvert par un service de `src/services/`.
2. Vérifier que le package n'est pas déjà dans le tableau du haut.
3. Vérifier qu'il figure dans le tableau des bibliothèques admises. Sinon, le proposer avant de
   l'installer, avec la raison technique.

Un package installé « au cas où » est une dette. `zustand` ne remplace pas `createStore` pour un état simple, `react-query` ne remplace pas `HttpService` pour un seul appel.

## Montées de version

- **Dans la même majeure** : `yarn up <paquet>@^<majeure>`, puis `yarn type-check && yarn lint && yarn build`. Épingler `next` et `@next/eslint-plugin-next` à la même version exacte.
- **Majeures décidées à part**, chacune dans son commit :
  - `tailwindcss` 4 (la palette est générée depuis `theme.json` par `tailwind.config.ts`, à migrer vers la configuration en CSS), qui entraîne `tailwind-merge` 3 ;
  - `typescript` 7, tant que `typescript-eslint` ne le déclare pas supporté ;
  - `@types/node` aligné sur la version de Node minimale du projet (`engines`), pas sur la dernière.
- `yarn` met en quarantaine les versions trop récentes : une erreur « quarantined » se résout en visant la version précédente, pas en forçant.
- Les logos des réseaux sociaux ne viennent plus de `lucide-react` : voir `declarations/ui/brandGlyphs.tsx`.
