---
name: conventions
description: Dictionnaire de nommage obligatoire du dépôt, partagé par tous les projets issus du template. À charger AVANT de nommer une route, un service, un composant, un formulaire, une variable, une clé de traduction ou un événement. Décrit la dérivation d'un identifiant canonique vers toutes ses formes.
---

# Conventions de nommage

Référence complète : `guide/CONVENTIONS.md`. Version exécutable : `src/declarations/naming.ts`
et `src/services/NamingService.ts`. Ce skill est le rappel opérationnel.

## Le principe, non négociable

Une intention se déclare **une fois**, en camelCase, verbe en tête, dans `ACTIONS`. Toutes les autres
formes se **dérivent**, jamais ne se retapent :

| Forme                | Dérivation                    | Pour `signUp`     |
| -------------------- | ----------------------------- | ----------------- |
| Segment d'URL        | `NamingService.toSlug`        | `/sign-up`        |
| Clé de traduction    | `NamingService.toActionKey`   | `actions.signUp`  |
| Événement analytique | `NamingService.toEventName`   | `sign_up`         |
| Identifiant DOM      | `NamingService.toDomId`       | `sign-up-email`   |
| Variable CSS         | `NamingService.toCssVariable` | `--color-primary` |

**« Créer un compte » s'écrit `signUp` partout.** Jamais `register`, `createAccount`, `inscription`
ni `newUser`. Idem pour `signIn`, `signOut`, `resetPassword`, `updateProfile`, `deleteAccount`,
`contact`, `subscribeNewsletter`, `requestQuote`, `bookAppointment`.

Avant de nommer une action, ouvrir `ACTIONS` dans `src/declarations/naming.ts`. Si elle y est,
utiliser ce nom. Si elle n'y est pas et qu'elle est réutilisable, l'y ajouter.

## Fichiers

| Type                    | Casse      | Suffixe      | Exemple                |
| ----------------------- | ---------- | ------------ | ---------------------- |
| Composant React         | PascalCase | `.tsx`       | `NavigationList.tsx`   |
| Service                 | PascalCase | `Service.ts` | `NavigationService.ts` |
| Registre déclaratif     | camelCase  | `.ts`        | `routes.ts`            |
| Configuration de projet | camelCase  | `.json`      | `identity.json`        |

Un fichier porte le nom de ce qu'il exporte. Jamais de `use<Quelque chose>.ts` : le dépôt n'a pas de
dossier `hooks/`, un comportement partagé est un service.

## Variables

| Nature                     | Règle                                | Exemple                 |
| -------------------------- | ------------------------------------ | ----------------------- |
| Booléen                    | `is`, `has`, `can`, `should`, `will` | `isOpen`, `hasNextPage` |
| Rappel en props            | préfixe `on`                         | `onPageChange`          |
| Implémentation d'un rappel | préfixe `handle`, ou verbe direct    | `handleSubmit`          |
| Registre exporté           | SCREAMING_SNAKE_CASE                 | `BUTTON_VARIANTS`       |
| Montant                    | suffixe `Cents`, entier              | `amountCents`           |
| Durée                      | suffixe d'unité                      | `timeoutMs`             |
| Identifiant de registre    | suffixe `Id`                         | `routeId`, `formId`     |

Aucune abréviation. `configuration`, pas `conf`. `navigation`, pas `nav`. `button`, pas `btn`.
Seules exceptions universelles : `id`, `url`, `html`, `api`, `seo`.

Une entité est **au singulier** ; sa liste porte le pluriel du même mot, jamais `xList` ni `xData`.

## Clés de traduction

Racines autorisées, déclarées dans `TRANSLATION_NAMESPACES` :

```
actions.<action>
routes.<routeId>.label|metaTitle|metaDescription
navigation.<zone>
sections.<section>.<champ>            sections.<section>.items.<id>.<champ>
forms.<formId>.fields.<champ>.label|placeholder|hint|choice|options.<valeur>
validation.<règle>       errors.<clé>       feedback.<clé>
legal.<page>.sections.<id>.title|body        showcase.<clé>
```

Toute clé existe dans **toutes** les locales. Une clé présente d'un seul côté est un bug.

## Props de composants

Interface exportée nommée `<Composant>Props`, typée explicitement. Une prop d'apparence porte un nom
de registre (`variant`, `tone`, `size`, `appearance`), jamais une classe ni une couleur. Une prop de
texte reçoit du texte **déjà traduit**, sauf dans les registres de contenu qui portent
explicitement `translationKey`. `className` vient en dernier et se fusionne avec `cn()`.
