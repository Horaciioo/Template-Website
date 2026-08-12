# guide/

Le guide du template : ce dossier décrit **ce qui doit rester vrai dans tout projet issu de cette
base**, et sert de documentation d'accompagnement pour quiconque reprend le projet. C'est la référence
à ouvrir avant d'écrire du code, et à recopier tel quel dans chaque nouveau dépôt — un projet dérivé ne
le réécrit jamais, il le lit.

## Par où commencer

| Situation                                                     | Fichier à ouvrir                      |
| ------------------------------------------------------------- | ------------------------------------- |
| Je démarre un nouveau projet client à partir du template      | [DEMARRAGE.md](DEMARRAGE.md), d'abord |
| Je cherche où poser un nouveau fichier                        | [ARBORESCENCE.md](ARBORESCENCE.md)    |
| Je cherche comment nommer une route, une action, une variable | [CONVENTIONS.md](CONVENTIONS.md)      |
| Je cherche si une brique existe déjà avant d'en écrire une    | [REGISTRE.md](REGISTRE.md)            |

| Fichier                            | Ce qu'il contient                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------------- |
| [ARBORESCENCE.md](ARBORESCENCE.md) | L'arbre imposé, le rôle de chaque dossier, et la règle « où poser un nouveau fichier »      |
| [CONVENTIONS.md](CONVENTIONS.md)   | Le dictionnaire de nommage : une intention, une orthographe, partout                        |
| [REGISTRE.md](REGISTRE.md)         | Chaque fonctionnalité livrée, ses fichiers, ses variables et ses clés de traduction         |
| [DEMARRAGE.md](DEMARRAGE.md)       | La liste exacte de ce qu'on modifie dans un nouveau projet, et de ce qu'on ne touche jamais |

## Ce qu'un projet dérivé peut et ne peut pas changer

Un projet issu du template modifie des **données** (`configurations/`, `declarations/`, `messages/`,
`public/images/`) et n'ajoute que rarement un fichier hors de ces dossiers. Il ne touche jamais
`services/`, `utils/`, `components/elements/`, `components/structures/`, `structures/`, `i18n/` ni ce
dossier `guide/` lui-même — la liste précise est dans [DEMARRAGE.md](DEMARRAGE.md) §2. Si une règle
manque à ce guide pour couvrir un besoin réel, elle se corrige **ici, dans le template**, jamais
localement dans un projet dérivé : c'est la seule direction qui garde tous les projets alignés.

## Les trois règles fondatrices

### 1. Aucun hardcoding

Une valeur qui décrit le projet — couleur, libellé, route, borne de validation, e-mail, colonne de
tableau, icône, seuil — se déclare **une seule fois** et se lit partout ailleurs. Trois endroits, et
trois seulement, ont le droit de porter une valeur :

- `src/configurations/*.json` — ce qui change d'un projet à l'autre (identité, thème, navigation, SEO)
- `src/declarations/**` — ce qui décrit le projet mais reste du code (routes, variantes, formulaires, icônes)
- `src/configurations/windows/messages/<locale>.json` — tout ce qu'un visiteur peut lire

Un composant ne contient donc **jamais** de phrase, de code couleur, de chemin d'URL ni de nombre magique.

### 2. Aucun doublon

Avant d'écrire une fonction, on cherche le service qui la porte déjà. Avant d'écrire une classe
Tailwind, on cherche la variante qui la porte déjà. Deux composants qui partagent un comportement
partagent une brique — voir `OverlayShell`, partagé par la fenêtre modale et le panneau latéral.

### 3. Pas de DRY abusif non plus

On ne factorise pas jusqu'à rendre le code illisible. Une abstraction se crée quand **le troisième**
usage arrive, pas quand le deuxième est imaginé. Une nouvelle abstraction se justifie techniquement,
et s'inscrit dans [REGISTRE.md](REGISTRE.md) le jour où elle est créée.

## Les couches, dans l'ordre de dépendance

```
configurations/  (JSON, données du projet)
        ↓
declarations/    (registres TypeScript, constantes)
        ↓
utils/           (fonctions pures, sans état, sans contexte)
        ↓
services/        (logique métier et technique, *Service.ts)
        ↓
components/      (rendu uniquement)
        ↓
app/             (assemblage des routes)
```

Une flèche ne remonte jamais. Un `utils/` n'importe pas un service. Un composant n'importe pas un
fichier de `configurations/` directement, il passe par `ConfigurationService`.
