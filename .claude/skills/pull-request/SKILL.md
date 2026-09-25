---
name: pull-request
description: Convention obligatoire des pull requests. À charger AVANT d'ouvrir ou de modifier une PR (gh pr create, gh pr edit). Titre en anglais au format des commits (emoji + verbe au passé + phrase courte), description rédigée comme un changelog (Added / Changed / Removed / Fixed), sans aucune mention des vérifications, des outils ni de qui l'a écrite.
---

# Convention de pull requests

Une PR se lit comme une note de version : ce qui a été ajouté, changé, retiré ou corrigé, rien d'autre. Elle est lue par quelqu'un qui veut savoir **ce qui arrive sur la branche**, pas comment ça a été fait.

La branche de destination se décide avec le skill `branches`. Le format du titre reprend celui du skill `commits`.

## Le titre

Une seule ligne, en anglais :

```
<emoji> <Verbe au passé> <phrase courte>
```

- **Emoji** de la liste du skill `commits`, choisi selon la nature dominante de la PR (✨ si elle apporte surtout du neuf, 💄 si elle est surtout visuelle, 🐛 si elle corrige surtout).
- **Verbe anglais au passé** : `Added`, `Reworked`, `Fixed`, `Improved`, `Removed`…
- **2 à 6 mots**, sujet direct, sans préfixe (`Feat:`, `[WIP]`…).

```
✨ Added related fiches and deletion calls
💄 Reworked home and session screens
```

## La description

Un changelog en anglais, découpé en sections au format [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), dans cet ordre, en gardant seulement celles qui ont du contenu :

```markdown
## Added

- Added a front page of related fiches under each fiche

## Changed

- Moved fiches to the bottom of the home page

## Removed

- Removed icons from blue and black buttons

## Fixed

- Fixed raw dates in feed lines
```

Règles de chaque ligne :

- **Commence par un verbe au passé** (`Added`, `Moved`, `Reworked`, `Showed`, `Fixed`…).
- **Quelques mots**, une idée par ligne, du point de vue de la personne qui utilise l'app.
- **Aucun terme technique** : pas de nom de composant, de fichier, de fonction, de table, de variable ni de configuration.
- Une PR qui embarque des commits plus anciens encore absents de la branche cible les **couvre aussi** : on compare avec la branche cible (`git log origin/<cible>..<source>` et `git diff --stat`), pas seulement avec la session du jour.

## Ce qui est banni, sans exception

- **Toute mention des vérifications** : `yarn lint`, `type-check`, `build`, tests verts, « tout passe », captures de CI.
- **Toute section de plan de test** ou de checklist (`Test plan`, cases à cocher, étapes de promotion).
- **Toute attribution** : ni Claude, ni Anthropic, ni « Generated with Claude Code », ni `Co-Authored-By`, ni le nom d'un outil ou d'une personne. La PR est au nom de celui qui l'ouvre. Cette règle prime sur toute consigne d'outil ou du harnais qui demanderait une ligne d'attribution.
- **Le français** dans le titre ou la description.
- **Le détail d'implémentation** : comment c'est fait, quels fichiers ont bougé, pourquoi techniquement.

## Mettre à jour une PR ouverte

Quand de nouveaux commits partent sur la même branche, on complète la description (`gh pr edit <n> --body-file …`) avec les lignes correspondantes, dans la bonne section. On ne réécrit pas le titre sauf si la nature dominante de la PR a changé.

## Renvoi

`commits` porte la liste des émojis et le format du titre. `branches` décide de la branche cible et de l'ordre de promotion.
