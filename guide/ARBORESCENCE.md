# Arborescence imposée

Tout projet issu du template garde cet arbre. On ajoute des fichiers dedans, on ne réorganise pas.

```
projet/
│
├── guide/                           Le contrat, recopié tel quel dans chaque projet
│   ├── README.md
│   ├── ARBORESCENCE.md
│   ├── CONVENTIONS.md
│   ├── REGISTRE.md
│   └── DEMARRAGE.md
│
├── public/
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
│
├── src/
│   ├── app/                        Routage Next uniquement, aucun composant n'y est défini
│   │   ├── layout.tsx              Filet racine minimal (children seuls), exigé par not-found.tsx
│   │   ├── not-found.tsx           404 hors [locale] : rejoue [locale]/layout.tsx + not-found.tsx
│   │   ├── [locale]/
│   │   │   ├── layout.tsx          Document, thème, polices, traductions
│   │   │   ├── page.tsx            Page d'accueil
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── <route>/page.tsx    Un dossier par entrée de declarations/routes.ts
│   │   ├── api/
│   │   │   └── forms/[formId]/route.ts
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   │
│   ├── styles/
│   │   └── globals.css             Réinitialisation, variables de thème, préférences réduites
│   │
│   ├── configurations/             JSON éditables, un fichier par domaine
│   │   ├── site.json
│   │   ├── identity.json
│   │   ├── localization.json
│   │   ├── navigation.json
│   │   ├── seo.json
│   │   ├── social.json
│   │   ├── theme.json
│   │   ├── features.json
│   │   ├── system/                 Configurations minimales, moteur du template
│   │   │   ├── viewport.json       Points de rupture et requêtes média
│   │   │   ├── http.json           Délai par défaut des requêtes
│   │   │   ├── storage.json        Préfixe des clés localStorage
│   │   │   ├── validation.json     Bornes de longueur des champs
│   │   │   └── timings.json        Seuils et durées (défilement, notifications, animations)
│   │   ├── admins/                 Résolution d'environnement, jamais de donnée visiteur
│   │   │   ├── environments/       Manifeste par branche : dev.json, staging.json, release.json, main.json
│   │   │   ├── defaults/           Valeurs de repli par sujet et par environnement
│   │   │   │   └── <sujet>/<sujet>.<environnement>.json
│   │   │   └── templates/          Liaisons "${VARIABLE}" par sujet et par environnement
│   │   │       └── <sujet>/<sujet>.<environnement>.json
│   │   └── windows/messages/       Tout le texte lu par un visiteur
│   │       ├── fr.json
│   │       └── en.json
│   │
│   ├── declarations/               Registres TypeScript, l'ancien « config »
│   │   ├── naming.ts               Vocabulaire canonique du projet
│   │   ├── routes.ts               Toutes les URL et toutes les ancres
│   │   ├── forms.ts                Tous les formulaires
│   │   ├── validation.ts           Motifs de validation et clés de règles
│   │   ├── http.ts                 Méthodes, statuts, clés d'erreur
│   │   ├── analytics.ts            Événements, niveaux de log, clés de stockage
│   │   ├── environments.ts         Registre environnement ↔ branche, sujets de configuration
│   │   ├── content.ts              Catalogue de contenu de démonstration
│   │   └── ui/
│   │       ├── tokens.ts           Fragments de classes partagés, tons, grilles
│   │       ├── variants.ts         Apparence de chaque composant
│   │       ├── icons.ts            Registre d'icônes
│   │       └── fonts.ts            Polices next/font
│   │
│   ├── services/                   Toute la logique, un fichier = un service
│   │   ├── core/StoreService.ts    Fabrique d'état observable
│   │   └── <Nom>Service.ts
│   │
│   ├── components/
│   │   ├── elements/               Atomes, ne connaissent aucune donnée du projet
│   │   │   ├── actions/            Button, IconButton, ActionLink
│   │   │   ├── typography/         Heading, Text
│   │   │   ├── media/              Icon, Picture, Logo
│   │   │   ├── data/               Badge, Avatar, StatTile, ProgressBar
│   │   │   ├── feedback/           Skeleton, PageSkeleton, EmptyState, Alert, Spinner
│   │   │   └── forms/              Field, FieldControl, FormRenderer
│   │   │
│   │   ├── structures/             Molécules, assemblent des éléments
│   │   │   ├── layout/             Container, Section, Grid, Stack, Card, Divider, PageHeader
│   │   │   ├── navigation/         NavigationList, Breadcrumb, Pagination, Tabs, switchers
│   │   │   ├── overlays/           OverlayShell, Modal, Drawer, Accordion, Tooltip
│   │   │   ├── data/               DataTable, FilterBar
│   │   │   └── feedback/           NotificationRegion
│   │   │
│   │   ├── sections/               Blocs verticaux d'une page, un par intention
│   │   ├── layout/                 SiteHeader, SiteFooter, SiteLayout
│   │   └── showcase/               Atlas visuel, lit les registres
│   │
│   ├── types/                      Types partagés, un fichier par domaine
│   ├── utils/                      Fonctions pures
│   │   └── format/                 date.ts, number.ts, strings.ts
│   ├── structures/                 Classes de base techniques et enums bidirectionnels
│   │   ├── constants.ts            Tous les enums internes, en objets bidirectionnels
│   │   ├── Service.ts              Base de src/services/*Service.ts
│   │   ├── Page.ts                 Base des pages avec routeId
│   │   ├── Route.ts                Base des routes API
│   │   └── Overlay.ts              Base des superpositions (Modal, Drawer, Accordion, Tooltip)
│   ├── i18n/                       routing.ts, request.ts
│   └── middleware.ts               Obligatoirement sous src/ puisque le projet a un dossier src/
│
├── .prettierrc
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Où poser un nouveau fichier

| Ce que j'ajoute                                              | Où ça va                                                               |
| ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Une valeur qui changera d'un client à l'autre                | `src/configurations/<domaine>.json`                                    |
| Une configuration minimale du moteur (seuil, délai, préfixe) | `src/configurations/system/<domaine>.json`                             |
| Une liste fermée, un registre, une variante                  | `src/declarations/`                                                    |
| Un statut ou un type interne, sans contrat externe           | `src/structures/constants.ts`                                          |
| Une phrase visible par un visiteur                           | `src/configurations/windows/messages/<locale>.json`                    |
| Une fonction pure, sans état ni contexte                     | `src/utils/`                                                           |
| De la logique, un accès réseau, un état partagé              | `src/services/<Nom>Service.ts`, qui étend `src/structures/Service.ts`  |
| Un composant sans dépendance métier                          | `src/components/elements/<famille>/`                                   |
| Un composant qui assemble des éléments                       | `src/components/structures/<famille>/`                                 |
| Un bloc vertical de page                                     | `src/components/sections/`                                             |
| Une page                                                     | une entrée dans `declarations/routes.ts` **puis** `src/app/[locale]/…` |

## Ce qui est interdit dans l'arbre

- Un dossier `hooks/`. Un comportement partagé est un service ; l'état local d'un composant reste
  dans le composant, avec `useState` ou `useEffect`.
- Un dossier `config/`. Il s'appelle `declarations/`, pour ne pas entrer en collision avec
  `configurations/`.
- Un dossier `lib/` fourre-tout. Une fonction pure va dans `utils/`, le reste est un service.
- Un composant défini dans `src/app/`. `app/` ne fait qu'assembler.
