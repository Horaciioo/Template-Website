---
name: architecture
description: Carte des couches du template et des systèmes centraux déjà en place (registres déclaratifs, services, moteur de formulaire, design system, i18n, SEO). À charger AVANT d'ajouter une page, une section, un formulaire, un composant, un service ou une entité, pour réutiliser l'existant au lieu de le redupliquer.
---

# Architecture du template

Ce dépôt est une **base réutilisable**, pas un site. Tout ce qu'on y écrit doit rester valable dans
n'importe quel projet suivant : aucun nom de client, aucun vocabulaire métier, aucune phrase.

## Avant d'écrire quoi que ce soit

Ouvrir `guide/`. Les quatre fichiers font autorité, ce skill n'en est que le résumé :

- `guide/ARBORESCENCE.md` — l'arbre imposé et « où poser un nouveau fichier »
- `guide/CONVENTIONS.md` — le dictionnaire de nommage
- `guide/REGISTRE.md` — chaque fonctionnalité, ses fichiers, ses variables, ses clés
- `guide/DEMARRAGE.md` — ce qu'on modifie et ce qu'on ne touche jamais dans un projet dérivé

**Vérifier dans `guide/REGISTRE.md` que la brique demandée n'existe pas déjà avant d'en écrire une.**

## Les couches, dans l'ordre de dépendance

```
configurations/         JSON du projet          →  identité, thème, navigation, SEO, drapeaux
configurations/system/  JSON minimal du moteur  →  points de rupture, délais, seuils, préfixes
declarations/           registres TypeScript    →  routes, variantes, formulaires, icônes, motifs
structures/             classes de base + enums →  Service, Page, Route, Overlay, constants.ts
utils/                  fonctions pures         →  ni état, ni contexte, ni service importé
services/               toute la logique        →  un fichier = un *Service.ts, étend Service
components/             rendu uniquement        →  elements → structures → sections → layout
app/                    assemblage des routes   →  aucun composant défini ici
```

Une flèche ne remonte jamais. Un composant n'importe pas un JSON de `configurations/`, il passe par
`ConfigurationService`. `declarations/` fait de même quand une valeur de `configurations/system/` lui
manque (`forms.ts` lisant `ConfigurationService.validation.limits`, par exemple) : c'est la seule
façade qu'il traverse, jamais un import direct du JSON.

## La règle fondatrice

Le hardcoding est banni. Une valeur qui décrit le projet — couleur, libellé, route, borne, e-mail,
colonne, icône, seuil — se déclare **une seule fois**, dans `configurations/`, `declarations/` ou
`messages/`, et se lit partout ailleurs.

Le DRY abusif est banni aussi. Une abstraction naît au **troisième** usage, pas au deuxième imaginé.
Toute nouvelle abstraction se justifie techniquement et s'inscrit dans `guide/REGISTRE.md` le jour
même.

## Pas de dossier `hooks/`

Un comportement partagé est un **service**. L'état local d'un composant reste dans le composant, avec
`useState` ou `useEffect`. Un état partagé passe par `createStore` de `services/core/StoreService.ts`,
qui monte ses écouteurs au premier abonné et les démonte au dernier.

Attention à la frontière serveur : `StoreService` importe React. Un service qui l'utilise ne peut être
importé que depuis un composant client. C'est pourquoi `ThemeService`, lu par le layout serveur, est
volontairement sans état.

## Les gestes courants

| Ce qu'on demande                 | Le geste, et rien de plus                                                              |
| -------------------------------- | -------------------------------------------------------------------------------------- |
| Ajouter une page                 | `ROUTES` + dossier sous `app/[locale]/` + bloc `routes.<id>` dans les deux `messages/` |
| Ajouter un formulaire            | une entrée dans `FORMS` + un bloc `forms.<id>` dans les deux `messages/`               |
| Ajouter une couleur              | une entrée dans `theme.json`, dans les deux palettes                                   |
| Ajouter un seuil/délai du moteur | une entrée dans le fichier concerné de `configurations/system/`                        |
| Ajouter une icône                | un import et une entrée dans `ICONS`                                                   |
| Ajouter une variante             | une entrée dans le registre concerné de `declarations/ui/variants.ts`                  |
| Ajouter une section de page      | un composant dans `components/sections/` qui s'appuie sur `Section`                    |
| Ajouter du texte                 | uniquement `messages/<locale>.json`                                                    |
| Ajouter un enum interne          | une entrée dans `structures/constants.ts`, en fin d'objet                              |
| Ajouter un service               | étendre `structures/Service.ts`, instancier une fois, exporter le singleton            |

Dans chaque cas, la navigation, le sitemap, les métadonnées, l'atlas et la validation suivent seuls.
Si un geste demande de toucher plus de fichiers que la colonne de droite, c'est qu'on est en train de
dupliquer un système existant.

## Les services livrés

`ConfigurationService`, `NamingService`, `EnvironmentService`, `I18nService`, `ThemeService`,
`NavigationService`, `SeoService`, `FormatService`, `ValidationService`, `FormService`, `HttpService`,
`StorageService`, `ViewportService`, `ScrollService`, `NotificationService`, `AnalyticsService`,
`LoggerService`, `MailService`.

Chacun a un monopole : `HttpService` est le seul à appeler `fetch`, `StorageService` le seul à toucher
`localStorage`, `LoggerService` le seul à écrire dans la console, `ConfigurationService` le seul à
importer un fichier de `configurations/`, `EnvironmentService` le seul à lire `process.env`.
Contourner un monopole est une régression.

Tous, sauf `ConfigurationService`, `EnvironmentService` et `LoggerService`, étendent
`structures/Service.ts` et s'exportent comme une instance unique (`export const XService = new
XServiceClass('scope')`). Ces trois-là restent des objets `as const` : ce sont les dépendances que
`Service` expose via `this.config`/`this.logger`, les étendre créerait un cycle de bootstrap.

## Classes de base et enums bidirectionnels — `structures/`

`structures/Service.ts`, `Page.ts`, `Route.ts` et `Overlay.ts` centralisent le comportement technique
commun de chaque famille (services, pages avec `routeId`, routes API, superpositions). Une classe de
base n'existe que là où un vrai comportement récurrent est factorisé — voir `guide/REGISTRE.md`
§26 pour le détail de chacune. Ne pas en créer une nouvelle pour une famille d'un seul membre.

`structures/constants.ts` regroupe tout enum interne (statut, rôle, type, origine) qui ne porte
**aucun contrat externe**, en objets bidirectionnels (`Idle: 0` et `0: 'Idle'` dans le même objet).
Un registre dont la valeur **est** un contrat externe (verbe HTTP, attribut DOM, type `<input>`, clé de
traduction, nom de branche git) reste dans `declarations/` : le renuméroter casserait ce système
externe. `guide/REGISTRE.md` §26 documente la frontière exacte.

## L'atlas visuel est un test

`/showcase` **lit les registres**, il ne recopie pas d'échantillons. Une couleur, une icône, un style
de texte ou une variante ajoutés doivent y apparaître **sans qu'on modifie l'atlas**. Si ce n'est pas
le cas, la brique a été écrite en dur quelque part.
