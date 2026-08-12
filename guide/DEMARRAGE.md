# Démarrer un nouveau projet

Ordre exact des gestes après avoir cloné le template. Le principe : **on modifie des données, pas du
code**. Si vous vous surprenez à éditer un composant pour changer un texte ou une couleur, arrêtez-vous,
c'est qu'une donnée manque quelque part.

## 1. Ce qu'on modifie, dans cet ordre

### Étape 1 — L'identité du projet

| Fichier                                | Ce qu'on y change                                                      |
| -------------------------------------- | ---------------------------------------------------------------------- |
| `src/configurations/site.json`         | `name`, `shortName`, `domain`, `launchYear`, `themeColor`, `logo`      |
| `src/configurations/identity.json`     | Raison sociale, e-mail, téléphone, adresse, immatriculation, hébergeur |
| `src/configurations/social.json`       | Les réseaux réellement tenus, `null` pour les autres                   |
| `src/configurations/seo.json`          | `titleTemplate`, image de partage, jetons de vérification              |
| `src/configurations/localization.json` | Langues, langue par défaut, fuseau, devise                             |
| `src/configurations/features.json`     | Les drapeaux à couper pour ce projet                                   |
| `package.json`                         | `name`                                                                 |

### Étape 2 — La direction artistique

| Fichier                         | Ce qu'on y change                                                  |
| ------------------------------- | ------------------------------------------------------------------ |
| `src/configurations/theme.json` | La palette claire **et** la palette sombre, les rayons, les ombres |
| `src/declarations/ui/fonts.ts`  | Les deux familles `next/font`                                      |

Les couleurs s'écrivent en canaux RVB séparés par des espaces (`79 70 229`), pour que Tailwind puisse
leur appliquer une opacité. Les deux palettes portent **exactement les mêmes clés**.

Vérification : ouvrir `/showcase`, la palette et l'échelle typographique doivent déjà être à la
nouvelle charte.

### Étape 3 — Les routes

1. `src/declarations/routes.ts` — supprimer `showcase` si l'atlas ne part pas en production, ajouter
   les pages du projet.
2. `src/app/[locale]/<route>/page.tsx` — un dossier par entrée, calqué sur `contact/page.tsx`.
3. `src/configurations/navigation.json` — en-tête, colonnes du pied de page, action principale.

### Étape 4 — Le contenu

1. `messages/fr.json` et `messages/en.json` — tout le texte. Les deux fichiers gardent la même forme.
2. `src/declarations/content.ts` — les listes de la page d'accueil (arguments, chiffres, offres,
   témoignages, questions, galerie).
3. `public/images/` — les visuels réels, en remplacement de `placeholder.svg`.

### Étape 5 — Les formulaires

`src/declarations/forms.ts` pour la forme et les règles, `messages/` pour les libellés. La route API,
la validation et l'envoi ne changent pas. Le formulaire `contact` redirige par défaut vers `/thank-you`
(`redirectRouteId`) plutôt que d'afficher un message inline : retirer ce champ pour revenir au
comportement inline, voir `guide/REGISTRE.md` §30.

### Étape 6 — L'environnement

Le projet distingue quatre environnements (`development`, `staging`, `release`, `production`), un par
branche (`dev`, `staging`, `release`, `main`). Chaque déploiement pose `APP_ENV` avec la bonne valeur :
sans elle, une compilation de production retombe sur `production`, l'environnement le plus strict. En
local, rien à faire : `development` s'applique tout seul.

Les variables lues par sujet sont déclarées dans `src/configurations/admins/templates/<sujet>/`, à titre
documentaire — c'est là qu'il faut regarder pour savoir quoi renseigner, jamais un fichier séparé :

| Variable                               | Sujet       | Où la poser                                      |
| -------------------------------------- | ----------- | ------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                 | `site`      | Chaque environnement déployé                     |
| `NEXT_PUBLIC_ANALYTICS_ENABLED`        | `analytics` | Pour forcer l'activation en dehors de la recette |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`      | `analytics` | Si le projet doit réellement remonter à GA4      |
| `MAIL_API_KEY`, `MAIL_FROM`, `MAIL_TO` | `mail`      | Si le formulaire doit réellement envoyer         |

Sans ces variables, chaque sujet reste en marche à vide sur ses valeurs de repli
(`src/configurations/admins/defaults/`) : un clone frais du template démarre sans configuration.

Avant de promouvoir une branche (`dev → staging`, `staging → release`, `release → main`) :

```bash
yarn check:environment
```

## 2. Ce qu'on ne touche jamais

Ces fichiers sont le socle. Les modifier dans un projet client, c'est faire diverger le template :
la correction devra être reportée à la main partout ailleurs.

```
src/services/**                Sauf pour ajouter un service, jamais pour en modifier un existant
src/utils/**
src/components/elements/**
src/components/structures/**
src/declarations/naming.ts
src/declarations/http.ts
src/configurations/system/**   Configurations minimales du moteur, pas des données du projet
src/configurations/admins/environments/**   Manifeste par branche, pas des données du projet
src/configurations/admins/templates/**      Liaisons "${VARIABLE}", pas des données du projet
src/services/core/StoreService.ts
src/i18n/**
src/middleware.ts
src/app/layout.tsx             Filet racine minimal, sans contenu de projet
src/app/not-found.tsx          Rejoue [locale]/layout.tsx et [locale]/not-found.tsx, rien à y écrire
guide/**
```

Si l'un d'eux doit vraiment changer, le changement se fait **dans le template**, puis redescend dans
les projets. C'est la seule direction autorisée.

## 3. Vérification avant de livrer

```bash
yarn type-check && yarn lint && yarn build
```

Les trois doivent être verts. Ensuite, à la main :

- [ ] `/showcase` affiche la charte du projet, pas celle du template
- [ ] les deux fichiers de `messages/` ont exactement les mêmes clés
- [ ] aucune phrase visible n'est écrite dans un `.tsx` — `grep -rn "[éèàù]" src/components` doit être vide
- [ ] aucune couleur en dur — `grep -rnE "#[0-9a-fA-F]{3,6}" src/components src/declarations` doit être vide
- [ ] `/sitemap.xml` ne liste que les routes réellement publiques
- [ ] le formulaire envoie un vrai courriel, ou reste volontairement en marche à vide
- [ ] `guide/REGISTRE.md` mentionne toute fonctionnalité ajoutée au projet

## 4. Faire remonter une amélioration vers le template

Le template est censé grossir à chaque projet. Quand une brique écrite pour un client est
manifestement réutilisable :

1. la rendre générique — aucun nom métier, aucun texte, aucune couleur du client ;
2. la déclarer dans le registre qui va bien (`declarations/`) plutôt qu'en dur ;
3. l'ajouter à l'atlas si elle est visuelle, en lisant son registre et non un échantillon écrit ;
4. écrire son entrée dans `guide/REGISTRE.md` ;
5. mettre à jour le skill concerné dans `.claude/skills/`.

Les cinq étapes vont ensemble. Une brique livrée sans son entrée de registre et sans son bloc d'atlas
sera oubliée au projet suivant, et réécrite.

## 5. Le back-end : faire exister les variables d'environnement

Une variable déclarée dans `src/configurations/admins/templates/<sujet>/` ne vient de nulle part par
magie : quelqu'un doit créer le compte externe, en extraire la valeur, puis la poser sur sa machine ou
sur l'hébergeur.

1. `.env`, à la racine, est déjà ignoré par git. Ses valeurs par défaut suffisent pour développer en
   local : site servi sur `http://localhost:3000`, analytique désactivée, mail en marche à vide.

2. Pour activer Google Analytics (GA4) : ouvrir Google Analytics → Admin → créer une propriété **GA4**
   → son flux de données web → copier l'identifiant `G-XXXXXXX`, le coller dans
   `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`.

3. Pour activer Vercel Analytics : aucun compte séparé à créer, il suffit de déployer le projet sur
   Vercel et d'activer Analytics dans le tableau de bord du projet, puis de passer
   `NEXT_PUBLIC_ANALYTICS_ENABLED` à `true`.

4. Pour que le formulaire de contact envoie un vrai courriel : créer un compte sur
   [resend.com](https://resend.com), vérifier un domaine d'envoi, générer une clé API et la coller dans
   `MAIL_API_KEY`. `MAIL_FROM` doit être une adresse de ce domaine vérifié (ex.
   `contact@votredomaine.fr`), `MAIL_TO` la boîte qui doit recevoir les messages.

5. Pour l'URL canonique de chaque environnement déployé : poser `NEXT_PUBLIC_SITE_URL` avec le vrai
   domaine, celui configuré chez l'hébergeur ou le registrar.

6. En recette et en production, ces variables se posent chez l'hébergeur (Vercel : Project Settings →
   Environment Variables), une valeur par environnement déployé, jamais dans le repo. `APP_ENV` doit
   correspondre à l'environnement réel du déploiement, sinon `EnvironmentService` retombe sur
   `production`, le plus strict.

7. Pour rendre un sujet réellement obligatoire (bloquer avant de promouvoir une branche s'il manque) :
   ajouter son nom dans `required` du manifeste concerné
   (`src/configurations/admins/environments/<environnement>.json`), puis lancer :

   ```bash
   yarn check:environment
   ```
