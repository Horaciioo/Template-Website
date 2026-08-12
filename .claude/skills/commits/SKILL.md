---
name: commits
description: Convention de commits git obligatoire du projet. À charger AVANT de créer un commit. Couvre le format du message (emoji + verbe anglais au passé + phrase courte, sans détail en dessous) et la règle de découpage des commits par fonctionnalité.
---

# Convention de commits

## Le format, non négociable

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

## Découper les commits par fonctionnalité

Chaque commit ne porte **le contenu que d'une seule fonctionnalité**. Ne jamais mélanger dans un commit des changements qui appartiennent à des sujets différents.

Exemple : les pages légales (mentions légales, politique de confidentialité) forment une fonctionnalité, elles se committent ensemble, séparément du reste. Dans ce dépôt, une fonctionnalité comprend aussi son entrée dans `guide/REGISTRE.md` et son bloc dans `messages/` : ils partent dans le même commit.

Exception : si les changements sont vraiment transverses et généraux (mise à jour de dépendances, config globale du dépôt), un seul commit suffit, sans découpage artificiel.

### Méthode

1. Regrouper les fichiers modifiés par fonctionnalité concernée.
2. Stager uniquement les fichiers de cette fonctionnalité (`git add <fichiers>`, jamais `git add -A` en aveugle).
3. Committer avec un message conforme au format ci-dessus.
4. Répéter pour chaque fonctionnalité restante.
