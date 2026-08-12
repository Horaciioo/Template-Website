# Conventions de nommage

Une intention n'a **qu'une seule orthographe** dans tout le dépôt, et dans tous les dépôts issus de ce template. Cette page est le dictionnaire. `src/declarations/naming.ts` en est la version exécutable, et `NamingService` dérive mécaniquement toutes les autres formes.

## Le principe

On déclare l'intention **une fois**, en camelCase, verbe en tête. Tout le reste se déduit :

| Forme                     | Dérivation                            | Exemple pour `signUp`  |
| ------------------------- | ------------------------------------- | ---------------------- |
| Identifiant canonique     | déclaré dans `declarations/naming.ts` | `signUp`               |
| Segment d'URL             | `NamingService.toSlug`                | `/sign-up`             |
| Clé de traduction         | `NamingService.toActionKey`           | `actions.signUp`       |
| Événement analytique      | `NamingService.toEventName`           | `sign_up`              |
| Identifiant de formulaire | clé de `declarations/forms.ts`        | `signUp`               |
| Identifiant DOM           | `NamingService.toDomId`               | `sign-up-email`        |
| Méthode de service        | l'identifiant tel quel                | `AuthService.signUp()` |

**« Créer un compte » s'écrit donc `signUp`, jamais `createAccount`, `register`, `inscription` ni
`newUser`.** La même règle vaut pour chaque entrée du dictionnaire ci-dessous.

## Dictionnaire des actions

Source de vérité : `ACTIONS` dans `src/declarations/naming.ts`.

| Intention métier                | Identifiant canonique          | Interdit                                 |
| ------------------------------- | ------------------------------ | ---------------------------------------- |
| Créer un compte                 | `signUp`                       | `register`, `createAccount`, `subscribe` |
| Se connecter                    | `signIn`                       | `login`, `connect`, `authenticate`       |
| Se déconnecter                  | `signOut`                      | `logout`, `disconnect`                   |
| Réinitialiser un mot de passe   | `resetPassword`                | `forgotPassword`, `newPassword`          |
| Modifier son profil             | `updateProfile`                | `editProfile`, `saveProfile`             |
| Supprimer son compte            | `deleteAccount`                | `removeAccount`, `closeAccount`          |
| Nous contacter                  | `contact`                      | `sendMessage`, `getInTouch`              |
| S'inscrire à la newsletter      | `subscribeNewsletter`          | `newsletter`, `signUpNewsletter`         |
| Demander un devis               | `requestQuote`                 | `quote`, `askQuote`, `devis`             |
| Prendre rendez-vous             | `bookAppointment`              | `book`, `reserve`, `takeAppointment`     |
| Obtenir l'itinéraire            | `getDirections`                | `directions`, `showRoute`, `openMaps`    |
| Créer / modifier / supprimer    | `create` / `update` / `delete` | `add` / `edit` / `remove`                |
| Rechercher / filtrer / trier    | `search` / `filter` / `sort`   | `find` / `refine` / `order`              |
| Confirmer / annuler / réessayer | `confirm` / `cancel` / `retry` | `validate` / `abort` / `again`           |
| Charger la suite                | `loadMore`                     | `showMore`, `seeMore`, `more`            |

Ajouter une intention se fait dans `ACTIONS`, et nulle part ailleurs.

## Dictionnaire des entités

Source de vérité : `ENTITIES` dans `src/declarations/naming.ts`. Toujours au **singulier**, en
camelCase. Une liste porte le pluriel du même mot, jamais un suffixe.

```
user, account, profile, session, message, article, category, media, offer, testimonial, question, plan
```

| Correct         | Interdit                             |
| --------------- | ------------------------------------ |
| `user`, `users` | `userList`, `usersData`, `userArray` |
| `article`       | `post`, `blogItem`, `contenu`        |
| `testimonial`   | `review`, `avis`, `feedbackItem`     |

## Fichiers

| Type de fichier         | Casse                               | Suffixe obligatoire                    | Exemple                             |
| ----------------------- | ----------------------------------- | -------------------------------------- | ----------------------------------- |
| Composant React         | PascalCase                          | `.tsx`                                 | `NavigationList.tsx`                |
| Service                 | PascalCase                          | `Service.ts`                           | `NavigationService.ts`              |
| Classe de base          | PascalCase, singulier, sans suffixe | `.ts`                                  | `Service.ts`, `Page.ts`, `Route.ts` |
| Registre déclaratif     | camelCase                           | `.ts`                                  | `routes.ts`, `ui/variants.ts`       |
| Enum bidirectionnel     | PascalCase, pluriel                 | déclaré dans `structures/constants.ts` | `FormStatuses`, `HttpStatuses`      |
| Configuration de projet | camelCase                           | `.json`                                | `identity.json`                     |
| Types partagés          | camelCase                           | `.ts`                                  | `navigation.ts`                     |
| Fonctions pures         | camelCase                           | `.ts`                                  | `format/date.ts`                    |

Un fichier porte le nom de ce qu'il exporte. `NavigationService.ts` exporte `NavigationService`, et
rien d'autre de public.

## Variables et propriétés

| Nature                       | Règle                                        | Exemple                              |
| ---------------------------- | -------------------------------------------- | ------------------------------------ |
| Booléen                      | préfixe `is`, `has`, `can`, `should`, `will` | `isOpen`, `hasNextPage`, `canSubmit` |
| Fonction de rappel en props  | préfixe `on`                                 | `onPageChange`, `onClose`            |
| Implémentation d'un rappel   | préfixe `handle` ou verbe direct             | `handleSubmit`, `select`             |
| Registre exporté             | SCREAMING_SNAKE_CASE                         | `BUTTON_VARIANTS`, `ROUTES`          |
| Constante locale d'un module | SCREAMING_SNAKE_CASE                         | `SCROLLED_THRESHOLD`                 |
| Montant monétaire            | suffixe `Cents`, stocké en entier            | `amountCents`                        |
| Durée                        | suffixe d'unité                              | `timeoutMs`, `lifetimeMs`            |
| Clé de traduction            | suffixe `translationKey`                     | `translationKey`                     |
| Identifiant de registre      | suffixe `Id`                                 | `routeId`, `formId`                  |

Aucune abréviation : `configuration` et pas `conf`, `navigation` et pas `nav`, `button` et pas `btn`.
Seules exceptions tolérées parce qu'elles sont universelles : `id`, `url`, `html`, `api`, `seo`.

## Clés de traduction

Une clé se lit comme un chemin, du plus général au plus précis. Les racines autorisées sont déclarées
dans `TRANSLATION_NAMESPACES` :

```
actions.<action>                              Libellé d'un bouton
routes.<routeId>.label|metaTitle|metaDescription
navigation.<zone>
sections.<section>.<champ>
sections.<section>.items.<id>.<champ>
forms.<formId>.fields.<champ>.label|placeholder|hint|choice
forms.<formId>.fields.<champ>.options.<valeur>
forms.<formId>.success
validation.<règle>
errors.<clé>
feedback.<clé>
legal.<page>.sections.<id>.title|body
showcase.<clé>
```

Toute clé absente d'une locale est un bug : les deux fichiers de `messages/` ont exactement la même
forme.

## Props de composants

- Toujours typées explicitement, par une interface exportée nommée `<Composant>Props`.
- Une prop d'apparence porte un nom de registre (`variant`, `tone`, `size`, `appearance`), jamais une
  classe ni une couleur.
- Une prop qui reçoit du texte reçoit du **texte déjà traduit**, jamais une clé — sauf pour les
  registres de contenu, qui portent explicitement `translationKey`.
- `className` est toujours la dernière prop, et toujours fusionnée avec `cn()`.

## Commentaires

En anglais, courts, ils expliquent **pourquoi**. Le format complet est décrit par le skill `code-style`.
