---
name: code-style
description: Règles de style obligatoires du dépôt : quotes, points-virgules, typage strict, imports, nommage, budgets de longueur (fonction, composant, fichier), pratiques pour garder un code court sans doublon, interdiction du hardcoding. À charger AVANT d'écrire ou de modifier le moindre fichier .ts/.tsx/.css. Le format des commentaires vit dans le skill `comments`, à charger séparément.
---

# Style de code

## Commentaires

Le format des commentaires (ultra-concision, anglais, structure des blocs JSDoc, choix du tag,
règle « JSDoc OU `//`, jamais les deux », interdiction des séparateurs décoratifs) vit dans le skill
`comments`, à charger avant d'écrire le moindre commentaire. Ne pas en dupliquer les règles ici.

## Syntaxe

- TypeScript obligatoire, `any` interdit (règle ESLint en `error`)
- Guillemets simples pour les chaînes TS, doubles pour les attributs JSX
- Pas de point-virgule en fin de ligne
- Fonctions fléchées pour les composants et les helpers
- Props et interfaces typées explicitement, jamais implicitement
- `import type` dès qu'un import ne sert qu'au typage
- Pas d'`enum` TypeScript (règle ESLint en `error`) : un statut/rôle/type interne, sans contrat
  externe, est un objet bidirectionnel `as const` dans `src/structures/constants.ts` ; un registre
  dont la valeur EST un contrat externe (verbe HTTP, attribut DOM, clé de traduction...) reste un
  registre `as const` à sens unique dans `declarations/`. Détail dans le skill `architecture`.

## Imports

Alias `@/` vers `src`, jamais de `../../..`. Ordre : dépendances externes, puis imports internes `@/`,
puis relatifs. Une ligne vide entre chaque groupe.

## Nommage

Le dictionnaire complet est dans le skill `conventions` et dans `guide/CONVENTIONS.md`. Résumé :
noms métier explicites, aucune abréviation, une intention n'a qu'une orthographe. Les fichiers portent
le nom de ce qu'ils exportent.

## Un code court qui vieillit bien

Le but n'est pas d'écrire moins de caractères, c'est de n'écrire que ce qui est nécessaire : chaque
ligne de trop est une ligne à relire, à tester et à casser. Avant de rendre du travail, relire son
propre diff avec cette question : « qu'est-ce qui peut disparaître sans rien changer au comportement ? ».

### Budgets, à ne pas dépasser sans raison écrite

| Élément                                                      | Budget                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------- |
| Fonction ou méthode                                          | 40 lignes de code, complexité 10, imbrication 3, 4 paramètres |
| Composant React                                              | 150 lignes, dont 80 de JSX, 8 props, 8 hooks, 6 `useState`    |
| `useEffect`                                                  | 20 lignes (au-delà, un service nommé)                         |
| Fichier de logique                                           | 300 lignes, 15 exports                                        |
| Fichier de pure donnée (`declarations/`, glyphes, registres) | Pas de plafond, mais une famille par fichier                  |

Un budget dépassé n'est pas une faute en soi, c'est un signal : on découpe en un dossier par
fonctionnalité (voir `architecture`) ou on écrit en commentaire de tête pourquoi ça reste d'un bloc.

### Chercher avant d'écrire

Avant de créer un helper, un composant, un type ou une constante, chercher s'il existe déjà : lire
`guide/REGISTRE.md`, puis `grep -rn` sur le nom et sur l'intention (`format`, `options`, `Variant`).
Les éléments de `components/elements/`, les services de `services/` et les registres de `declarations/`
existent pour être réutilisés. Ne pas écrire un wrapper qui se contente de renommer ou de réexposer.

### Ne pas répéter, sans abstraire à l'avance

- **Règle de trois** : une répétition se tolère, la troisième se factorise. Une abstraction écrite
  « au cas où » coûte plus qu'une répétition.
- **Dériver, ne pas redéclarer** : types depuis les valeurs (`(typeof X)[number]`, `keyof typeof`),
  depuis les fonctions (`Parameters`, `ReturnType`, `Awaited`), depuis d'autres types (`Pick`, `Omit`,
  `Partial`). Une valeur calculable se calcule, elle ne se stocke pas dans un deuxième état.
- **Une seule déclaration d'une valeur métier**, voir `architecture` (règle fondatrice).

### Raccourcir sans obscurcir

- **Garde précoce** : `if (!x) return` en tête plutôt que des blocs imbriqués.
- **Table à la place d'une chaîne** : un `switch` ou une suite de `if (kind === …)` de plus de trois
  branches devient un `Record<Kind, handler>`. La complexité retombe, ajouter un cas ne touche plus
  la fonction centrale, TypeScript signale un cas oublié.
- **Une fonction, une intention** : son nom remplace le commentaire. Une fonction qui valide, écrit et
  notifie devient trois fonctions.
- **Fonctions pures hors des composants** : un calcul de plus de 10 lignes va dans `utils/` ou dans
  un service, testable sans React.
- **Pas de composant en closure** : un `renderX` de plus de 20 lignes dans un composant est un
  composant : il a son fichier et ses props.
- **Natif récent plutôt que boucle écrite** : `Object.groupBy`, `flatMap`, `Object.fromEntries`,
  `.at()`, `??=`, `structuredClone`, `Set` pour les appartenances.
- **Objet à partir de 5 paramètres** ou 8 props : un paramètre nommé `{ … }`.

### Rien ne reste « au cas où »

- Pas de code commenté, pas d'export jamais importé, pas de paramètre inutilisé, pas de drapeau mort :
  on supprime, l'historique git garde la trace.
- Un composant, un helper ou un jeton créé pour une maquette abandonnée se supprime avec elle.
- Vérification avant de rendre : chaque export ajouté est importé ailleurs
  (`grep -rnw "nom" src | grep -v "fichier-d'origine"` ne doit pas être vide).

## Interdiction du hardcoding, vérifiable

Un composant ne contient ni phrase, ni couleur, ni chemin d'URL, ni nombre magique.

```bash
# Aucune phrase française dans un composant
grep -rn "[éèàùêôç]" src/components

# Aucune couleur écrite en dur
grep -rnE "#[0-9a-fA-F]{3,6}" src/components src/declarations

# Aucun import direct des librairies masquées par un registre
grep -rn "from 'lucide-react'" src/components | grep -v "declarations/ui/icons"
```

Les trois doivent être vides.

## Validation, non négociable avant de rendre du travail

```bash
yarn type-check && yarn lint && yarn build
```

Les trois doivent être verts. `yarn format` applique Prettier, `yarn format:check` le vérifie.
`yarn validate` enchaîne les trois.
