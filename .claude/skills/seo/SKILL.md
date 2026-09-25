---
name: seo
description: Référencement d'un site vitrine Bazalthe — convertir avant d'attirer, une page à la fois, une source par affirmation, ce qui ne sert à rien (llms.txt, schema pour les IA), et la base technique du template (métadonnées, canonical, hreflang, sitemap, robots, données structurées, vitesse). À charger AVANT de créer ou réécrire une page publique, un texte de `src/configurations/windows/messages/`, une route indexable, et dans la checklist de livraison. Ne s'applique pas aux dashboards, qui ne s'indexent jamais.
---

# SEO, site vitrine

Deux moitiés. La **stratégie** vient d'un article de Machina (@EXM7777, sponsorisé par Viktor, septembre 2026) : on en garde le fond, qui recoupe ce qu'on voit chez nos clients. La **technique** est déjà câblée dans le template : la vérifier, ne pas la réécrire.

## Stratégie

**1. Convertir avant d'attirer.** Du trafic sur une page qui ne convertit pas coûte sans rapporter. Avant tout travail de référencement, la page doit dire en une phrase ce que fait le client, pour qui, et porter une action claire (réserver, appeler, demander un devis) visible sans défiler sur mobile. Mesurer ce taux (GA4, événements `formSubmitted`) avant de chercher du volume.

**2. Une page à la fois.** Choisir la page qui a le plus de valeur (celle qui vend), la finir entièrement (intention de recherche, titre, texte, preuves, maillage, vitesse), mesurer, puis passer à la suivante. Dix pages à moitié optimisées ne se classent pas.

**3. Une page = une intention.** Une requête principale par page, écrite comme la tape un client (« coach sportif Nantes », pas « accompagnement holistique »). Le `metaTitle` la porte au début, le `h1` la reformule, le premier paragraphe y répond.

**4. Une source pour chaque constat.** Un chiffre, une affirmation de santé, un résultat client : une source nommée (étude, organisme, client qui l'accepte) ou on le retire. Les moteurs comme les IA citent ce qui est vérifiable ; un lecteur fait confiance à ce qu'il peut vérifier.

**5. Du contenu que personne d'autre ne peut écrire.** Photos réelles du client et de son lieu, exemples réels, prix réels, questions que ses clients posent vraiment. Pas de texte générique (voir `ai-tells`, signes 5 et 6).

**6. Ce qui ne sert à rien.**

- `llms.txt` : aucun moteur ni assistant ne s'en sert pour classer ou citer. Ne pas en créer.
- Données structurées « pour être cité par les IA » : le balisage schema.org n'aide pas à être cité par un assistant. Il reste utile pour Google (fiche d'entreprise locale, avis, FAQ) : on le garde pour ça, sans en attendre plus.
- Pages créées en masse pour des villes ou des mots-clés voisins : contenu mince, pénalisé.

## Technique, déjà en place dans le template

| Point                                   | Où                                                                                                               | À vérifier                                                                               |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Titre et description par page, traduits | `SeoService.buildMetadata`, clés `metaTitle` / `metaDescription` de `src/configurations/windows/messages/*.json` | Uniques, requête principale au début du titre, 150 à 160 caractères pour la description. |
| Gabarit de titre                        | `configurations/seo.json`, `titleTemplate`                                                                       | Séparateur `\|`, jamais un tiret cadratin.                                               |
| Canonical                               | `alternates.canonical`                                                                                           | URL absolue de la langue courante.                                                       |
| Hreflang                                | `I18nService.hreflangOf`, métadonnées et `sitemap.ts`                                                            | Chaque langue plus `x-default` (langue par défaut).                                      |
| Robots                                  | `robots.ts`, `robots` par route (`indexable: false`), `environment.seo.noindex`                                  | Staging et preview en `noindex`, pages merci / légales hors index si voulu.              |
| Sitemap                                 | `sitemap.ts`                                                                                                     | Seulement les routes indexables, une entrée par langue.                                  |
| Open Graph, Twitter                     | `SeoService.buildMetadata`, `seo.defaultImage`                                                                   | Image 1200×630 réelle du client.                                                         |
| Données structurées                     | `SeoService.buildOrganizationSchema`                                                                             | Identité, adresse, téléphone exacts (identiques à la fiche Google).                      |
| Vérification moteurs                    | `verification.google`, `msvalidate.01`                                                                           | Jetons par environnement dans `configurations/admins/`.                                  |
| Titres                                  | Un seul `h1` par page (`Heading level={1}` dans `HeroSection` ou `PageHeader`), hiérarchie continue              | `grep -rn "level={1}" src`.                                                              |
| Images                                  | `next/image`, `alt` traduit                                                                                      | Aucune image sans `alt` porteur de sens.                                                 |
| Vitesse                                 | PageSpeed ≥ 80 mobile et desktop                                                                                 | Mesuré sur l'URL de production (`delivery-checklist`).                                   |

## Vérification rapide

```bash
grep -rn "titleTemplate" src/configurations/seo.json          # séparateur |
grep -rn "x-default" src/services/I18nService.ts              # hreflang complet
grep -rn "indexable: false" src/declarations/routes.ts        # pages hors index voulues
grep -rLE "generateMetadata" $(find src/app -name page.tsx)   # page sans métadonnées : doit être vide
curl -s https://DOMAINE/robots.txt; curl -s https://DOMAINE/sitemap.xml | head
```
