---
name: branches
description: Stratégie de branches git obligatoire du projet. À charger AVANT tout git push, git merge ou création de PR. Décrit les quatre branches (dev, staging, release, main), leur rôle et l'ordre de promotion de l'une vers l'autre.
---

# Stratégie de branches

## Les quatre branches

1. **`dev`** — tout ce qui sert au développement, la branche la plus instable. **On ne travaille QUE dessus.** Tout commit, sans exception, part d'ici.
2. **`staging`** — sert à tester toutes les fonctionnalités. C'est sur elle que Vercel se base.
3. **`release`** — les fonctionnalités approuvées par les testeurs : utilisable, fonctionnel, scalable. Il peut y rester un passage d'optimisation à faire.
4. **`main`** — livrable client, résultat final. **Branche à ne plus jamais toucher.**

## Où on travaille

Toujours `dev`. Avant de commencer une tâche, vérifier la branche courante (`git branch --show-current`) ; si ce n'est pas `dev`, basculer dessus avant d'écrire la moindre ligne.

## L'ordre de promotion

Une fonctionnalité avance dans un seul sens, jamais dans l'autre :

```
dev → staging → release → main
```

Chaque flèche est une décision distincte (fin de développement, validation des testeurs, mise en production), jamais un geste automatique.

## Après chaque merge, resynchroniser la branche source

Quand une PR `dev → staging` (ou `staging → release`, `release → main`) est mergée sur GitHub, la branche source locale ne récupère pas automatiquement ce merge. Si le développement continue directement sur cette branche locale sans la resynchroniser, elle repart d'un point _antérieur_ au merge : elle recrée des fichiers déjà passés en aval, avec un contenu qui diverge peu à peu. Résultat quelques semaines plus tard : des dizaines de conflits "add/add" au moment de repromouvoir, sur des fichiers qui existent des deux côtés avec un historique différent.

Après toute PR mergée, avant de continuer à travailler :

```
git checkout dev && git fetch origin && git merge origin/dev
```

(remplacer `dev` par la branche concernée). Un `git log --oneline --merges <branche>` qui ne montre jamais de merge entrant est un signal que cette resynchronisation n'a pas eu lieu depuis un moment — à vérifier avant toute promotion vers la branche suivante.

## `main` ne se touche jamais à la légère

Sur toute demande de push, de merge ou d'ouverture de PR vers `main` :

1. Vérifier **ostensiblement**, fonctionnalité par fonctionnalité, que chacune est bien passée par `dev` → `staging` → `release` avant d'arriver là.
2. Le dire **explicitement** à l'utilisateur : quelles fonctionnalités sont couvertes, laquelle ne l'est pas si c'est le cas.
3. Ne jamais pousser vers `main` une fonctionnalité qui a sauté une étape, même sur demande explicite sans cette vérification — signaler le manque avant d'agir.

## Danger : dépôt situé dans un dossier synchronisé (iCloud Drive, Dropbox, OneDrive…)

Si le dépôt vit dans un dossier géré par un service de synchronisation cloud (typiquement `~/Documents` ou `~/Desktop` avec l'option macOS « Dossiers Bureau et Documents » d'iCloud activée), les opérations git qui réécrivent beaucoup de fichiers d'un coup (`checkout`, `merge`, `reset`) peuvent être interceptées en plein vol par le démon de synchronisation. Celui-ci croit alors voir une édition concurrente et crée des copies de conflit `nom 2.ext`, `nom 3.ext` — parfois par dizaines, y compris des dossiers vides ou un `.git/index 2`.

Signes qui doivent alerter : après un `checkout`/`merge`, `git status` liste des fichiers non suivis au nom suffixé d'un chiffre, qui n'existaient pas avant.

Réflexe : vérifier avec `cmp -s fichier "fichier 2.ext"` que le doublon est bien identique à l'original avant de le supprimer (jamais de suppression à l'aveugle), puis nettoyer — ces fichiers ne sont jamais suivis par git donc leur suppression est sans risque une fois l'identité confirmée.

Correctif définitif côté utilisateur (à suggérer, pas à faire soi-même) : exclure le dossier du repo de la synchronisation iCloud, ou déplacer le repo hors de `~/Documents`/`~/Desktop`.

## Renvoi

Ce skill ne décrit que la **destination** d'un commit (quelle branche). Le **format** du message de commit (emoji, verbe, découpage par fonctionnalité) est décrit par le skill `commits`, à charger séparément.
