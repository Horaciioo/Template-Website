---
name: commits
description: Convention de commits git obligatoire du projet. À charger AVANT de créer un commit. Couvre le format du message (emoji + verbe anglais au passé + phrase courte, sans détail en dessous) et la règle de découpage des commits par fonctionnalité.
---

# Convention de commits

## Le format, non négociable

Le titre et la description d'une pull request suivent le skill `pull-request` (anglais, format changelog, aucune mention des vérifications ni d'attribution).

Un message de commit tient sur **une seule ligne** :

```
<emoji> <Verbe anglais au passé> <phrase très courte>
```

- **Emoji** en premier, choisi parmi la liste ci-dessous (référence [gitmoji.dev](https://gitmoji.dev)).
- **Verbe en anglais, au passé** (`Added`, `Fixed`, `Updated`, `Improved`, `Removed`, `Refactored`, `Renamed`, `Moved`, `Simplified`, `Cleaned`, `Configured`, `Documented`, `Tested`, `Secured`, `Replaced`, `Reverted`, `Upgraded`, `Downgraded`, `Pinned`, `Seeded`, `Wired`, `Started`, `Tagged`, ...).
- **Phrase très courte**, sujet direct, pas de terme compliqué.

### Bon exemple

```
🔧 Improved the files
🔧 Updated yarn packages
```

### Mauvais exemple

A jamais faire, même si le commit est très petit ou très simple. Le message doit rester clair et précis.

```
🔧 Feat : Eslint configuration
- Improved the files
- Refactored the logic
- ...
```

## Ce qui est banni, sans exception

- **Phrase trop longue.** Une ligne, un sujet, rien de plus.
- **Détail sous forme de tirets** (`- Improved the files`, `- Refactored the logic`, ...). Le message ne fait jamais deux lignes.
- **Préfixe de type conventionnel** (`Feat :`, `Fix :`, `Chore :`, ...). L'emoji porte déjà cette information.
- **Terme compliqué ou jargon.** Un verbe simple et concret suffit.
- **Sur-précision qui sonne artificiel** (`EXCEPT`, `ONLY`, majuscules d'insistance, détail de portée ou d'exception dans le message). Le message doit sonner comme une phrase naturelle qu'un développeur écrirait spontanément, pas comme une description exhaustive du diff.

Si le message ne tient pas sur une phrase courte et directe, c'est que le commit est trop large : le découper plutôt que de résumer.

### Naturel avant tout

Toujours préférer la formulation la plus simple et la plus courte qui reste vraie, même si elle ne couvre pas 100% du détail du commit. Le detail exact se lit dans le diff, pas dans le message.

```
📝 Updated Readme                        (pas "Simplified project README")
🙈 Ignored markdown files                (pas "Ignored Markdown files EXCEPT README")
```

## Émojis de référence

Choisir l'emoji qui correspond à la nature du changement, pas au fichier touché.

| Emoji   | Usage                                                       |
| ------- | ----------------------------------------------------------- |
| ✨      | Nouvelle fonctionnalité                                     |
| 🐛      | Correction de bug                                           |
| 🩹      | Correctif mineur, non critique                              |
| 🚑️      | Correctif urgent/critique                                   |
| ♻️      | Refactorisation sans changement de comportement             |
| 💄      | Interface, style visuel, Tailwind                           |
| 🚸      | Expérience utilisateur, ergonomie                           |
| 📱      | Responsive, mobile                                          |
| 💫      | Animation, transition                                       |
| ♿️      | Accessibilité                                               |
| 🏗️      | Changement d'architecture                                   |
| 🗃️      | Base de données, migration Prisma                           |
| 🏷️      | Types TypeScript                                            |
| 🦺      | Validation (schémas, formulaires)                           |
| 🛂      | Auth, rôles, permissions                                    |
| 🔒️      | Sécurité                                                    |
| ✅      | Tests                                                       |
| 🔧      | Fichiers de configuration (ESLint, Tailwind, tsconfig, ...) |
| 🔨      | Scripts de développement                                    |
| ➕ / ➖ | Ajout / suppression d'une dépendance                        |
| ⬆️ / ⬇️ | Montée / descente de version d'une dépendance               |
| 🚨      | Correction d'avertissements lint/compilateur                |
| 🔥      | Suppression de code ou de fichiers                          |
| ⚰️      | Suppression de code mort                                    |
| 🚚      | Déplacement ou renommage de fichiers                        |
| 📝      | Documentation                                               |
| 💬      | Libellés et textes affichés                                 |
| 🌐      | Internationalisation                                        |
| 🍱      | Assets (images, icônes, polices)                            |
| 🌱      | Fichiers de seed                                            |
| 📦️      | Build, fichiers compilés                                    |
| 🚀      | Déploiement                                                 |
| 🙈      | `.gitignore`                                                |
| 🎉      | Démarrage d'un projet                                       |
| ⚡️      | Performance                                                 |
| 🧑‍💻      | Expérience développeur, interfaces et types utilitaires     |

## Référence : les 20 premiers commits de terminal-bot

`terminal-bot` donne le **rythme et le découpage** d'un démarrage de projet. Ses 20 premiers commits (2025-08-31 au 2025-09-02) sont de Maks (Maksen Lasmi), sauf `🎨 Added first design`, de Jérémy. C'est ce genre de commits qu'on veut : un sujet par commit, dans cet ordre.

| #   | Message                                                 | Fichiers regroupés                                                                                                              |
| --- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `🎉 Beginning of the project`                           | README                                                                                                                          |
| 2   | `📦️ Added all packages`                                 | `package.json`, lockfile, configuration Yarn                                                                                    |
| 3   | `🔧 Added all editor configuration files`               | EditorConfig, ESLint, Prettier, jsconfig                                                                                        |
| 4   | `🙈 Added gitignore file`                               | `.gitignore`                                                                                                                    |
| 5   | `🚀 Added GitHub Action Deployment file`                | workflow de déploiement                                                                                                         |
| 6   | `🎨 Added the structure`                                | socle complet : `index.js`, commande admin, components, configurations, events, handlers, managers, services, structures, utils |
| 7   | `🗃️ Added all entities (users, cards, files, etc..)`    | entités, modèles et structures                                                                                                  |
| 8   | `✨ Added some game commands (daily, inventory, etc..)` | commandes de la catégorie jeu                                                                                                   |
| 9   | `✨ Updated embeds commands`                            | commandes d'embeds                                                                                                              |
| 10  | `✨ Added cards commands`                               | commande admin d'un objet du jeu                                                                                                |
| 11  | `✨ Added points commands`                              | commande admin de la monnaie                                                                                                    |
| 12  | `🧑‍💻 Added interfaces for Message Formater`              | `.d.ts` d'un composant                                                                                                          |
| 13  | `⚡️ Added booster and card services`                    | services des systèmes et branchement dans `InteractionCreate`                                                                   |
| 14  | `🎨 Improved the structure`                             | `Command`, `constants`, `utils`                                                                                                 |
| 15  | `✨ Added the beginning of the card system`             | premier système complet : assets, manager d'images, service, commandes retouchées                                               |
| 16  | `♻️ Refactor code`                                      | petits ajustements d'entités                                                                                                    |
| 17  | `🎨 Added first design`                                 | premier design des commandes (commit de Jérémy)                                                                                 |
| 18  | `🔧 Updated some configuration templates`               | templates de configuration                                                                                                      |
| 19  | `Merge remote-tracking branch 'origin/main'`            | merge automatique, à ne pas imiter                                                                                              |
| 20  | `🐛 Fixed transaction type`                             | correctif d'un type de transaction                                                                                              |

Ce qu'il faut en retenir :

- **L'ordre est fixe** : projet, paquets, configuration de l'éditeur, gitignore, déploiement, structure, données, commandes, services, améliorations.
- **Une famille de fichiers par commit** : toutes les entités ensemble, les commandes d'une catégorie ensemble, les services ensemble.
- **Les messages de cette liste gardent leur forme d'origine**, y compris les parenthèses d'exemples (`etc..`) et `Refactor code`. Ils sont l'exception à la longueur habituelle et servent de modèle, pas de règle de rédaction pour les autres commits.
- Le merge (#19) est le seul commit sans emoji : ne pas l'imiter.

Cette liste vient d'un bot Discord : la **transposer** à ce projet en gardant l'ordre et le découpage, et en remplaçant les fichiers propres à Discord (entités, commandes, managers) par leurs équivalents ici. Un projet range son plan de reconstruction dans `.claude/commits/` (un fichier `.md` qui répertorie les commits à faire) et le suit avant de committer.

### Découper un système (référence michou-bot)

`michou-bot` construit un système en plusieurs commits, un par couche, là où `terminal-bot` en fait moins. Exemple du système coins (2025-02-13), à imiter pour chaque nouveau système :

- `🗃 Created entities for coins, boosts and transactions`
- `🧑‍💻 Added an helper for manage coins`
- `✨ Added many drops (coins system)`
- `✨ Added daily command`
- `🧑‍💻 Added drop types constants`
- `🔧 Added coins production configuration file`

Ordre : entités, helper et constantes, commandes, services, configuration (un commit `🔧` à part). Les anciens systèmes vont plus loin : `Adding tickets command`, `Adding tickets services`, `Adding tickets entities`, un commit chacun. Les émojis restent ceux de `terminal-bot`, aussi ceux du michou-bot récent (`✨ 🗃️ 🧑‍💻 🔧 🎨`). Le `🚩` de 2022 n'est plus utilisé.

## Découper les commits par fonctionnalité

Chaque commit ne porte **le contenu que d'une seule fonctionnalité**. Ne jamais mélanger dans un commit des changements qui appartiennent à des sujets différents.

Exemple : les pages légales (mentions légales, politique de confidentialité) forment une fonctionnalité, elles se committent ensemble, séparément du reste. Dans ce dépôt, une fonctionnalité comprend aussi son entrée dans `guide/REGISTRE.md` et son bloc dans `src/configurations/windows/messages/` : ils partent dans le même commit.

Exception : si les changements sont vraiment transverses et généraux (mise à jour de dépendances, config globale du dépôt), un seul commit suffit, sans découpage artificiel.

### Méthode

1. Regrouper les fichiers modifiés par fonctionnalité concernée.
2. Stager uniquement les fichiers de cette fonctionnalité (`git add <fichiers>`, jamais `git add -A` en aveugle).
3. Committer avec un message conforme au format ci-dessus.
4. Répéter pour chaque fonctionnalité restante.
