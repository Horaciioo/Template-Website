---
name: delivery-checklist
description: Checklist obligatoire avant toute livraison client d'un site dérivé de ce template. À charger AVANT de mettre en ligne ou d'annoncer un projet "prêt". Couvre les restes du template, le responsive (3 tailles), PageSpeed, l'indexation, les mentions légales et le RGPD, les formulaires, GA4, HTTPS et le suivi de panne, et renvoie aux grilles `security`, `resilience`, `ai-tells` et `seo`.
---

# Checklist avant livraison client

Aucune case ne se coche sans vérification réelle. Ne jamais déclarer un point validé sans l'avoir exécuté, ou sans avoir demandé à l'utilisateur de le confirmer quand l'outil n'est pas accessible depuis cet environnement (compte GA4, hébergeur, registrar).

Quatre grilles se rejouent avant cette checklist, et leur compte rendu accompagne la livraison :

- `security` : en-têtes, tiers déclarés dans la CSP et la politique de confidentialité, consentement, anti-abus des formulaires, secrets, audit des dépendances.
- `resilience` : erreur, chargement et vide, délais, double clic, poids des fichiers, alerte de panne.
- `ai-tells` : les huit signes d'un design généré (contraste mesuré, survols qui pâlissent, tirets cadratins, buzzwords…).
- `seo` : une intention par page, métadonnées uniques, canonical, hreflang, sitemap, données structurées.

## 0. Plus rien du template

- Aucune valeur d'exemple dans `site.json`, `identity.json`, `social.json`, `seo.json`, `localization.json` (voir `guide/DEMARRAGE.md`).
- Aucun texte d'exemple dans `src/configurations/windows/messages/`, aucune image du template dans `public/`.
- La route `showcase` retirée de `src/declarations/routes.ts` si l'atlas ne part pas en production.
- Les drapeaux de `features.json` coupés ou activés en connaissance de cause.

## 1. Responsive mobile, 3 tailles minimum

| Appareil        | Résolution CSS |
| --------------- | -------------- |
| iPhone SE       | 375 × 667      |
| iPhone 15       | 393 × 852      |
| iPad (portrait) | 768 × 1024     |

- Chrome DevTools, mode Device Toolbar, ces trois presets.
- À chaque taille : pas de scroll horizontal, cibles tactiles d'au moins 44 × 44 px, texte lisible sans zoom, menu et tiroirs utilisables au doigt.
- Rejouer le parcours principal (navigation, formulaire de contact, prise de rendez-vous), pas seulement l'accueil.
- Thème clair **et** thème sombre.

## 2. PageSpeed ≥ 80

- [PageSpeed Insights](https://pagespeed.web.dev) sur l'URL de production, **mobile ET desktop**, 80 minimum sur les deux.
- En dessous : leviers du skill `optimization` avant de relivrer.
- Noter le score obtenu quelque part de traçable (message de livraison) : un score non mesuré n'est pas un score validé.

## 3. Indexation

Un site vitrine se référence : c'est l'inverse d'un dashboard.

- En production, `robots.txt` autorise l'exploration et `sitemap.xml` liste les routes indexables ; staging et prévisualisations restent en `noindex` (`environment.seo.noindex`, voir `seo`).
- Les pages « merci » et les pages à ne pas référencer portent `indexable: false`.
- Le site est déclaré dans Google Search Console et Bing Webmaster Tools (jetons dans `configurations/admins/`), le sitemap soumis.

## 4. Mentions légales et RGPD

- Mentions légales et politique de confidentialité présentes, à jour, sans placeholder : éditeur, hébergeur, directeur de publication.
- Bandeau de consentement **avant** tout cookie non essentiel (analytics compris), refus aussi simple que l'acceptation, aucune case pré-cochée (recommandations CNIL).
- Formulaires : mention du traitement des données, base légale, moyen d'exercer ses droits.
- Tout tiers appelé par le navigateur est dans la CSP **et** dans la politique de confidentialité (skill `security`).

## 5. Formulaires testés

- Chaque formulaire : soumission valide (le message arrive bien dans la boîte du client), soumission invalide (les erreurs s'affichent, aucun échec silencieux).
- Cas limites : champs vides, formats invalides, copier-coller, saisie très longue.
- Retour clair après envoi (succès, erreur), bouton désactivé pendant l'envoi.
- Protection anti-spam active : `HoneypotField` présent, limite par IP (`this.limit`) sur la route.
- Testé sur au moins un des trois gabarits mobiles.

## 6. Analytics, GA4

- ID de mesure en variable d'environnement, jamais en dur ; drapeau `analytics` activé.
- Chargé **uniquement après consentement** (`AnalyticsGate`), jamais en `beforeInteractive`.
- Réception d'événements vérifiée en temps réel dans GA4 après déploiement, pas seulement la présence du script dans le HTML.

## 7. HTTPS, domaine, suivi de panne

- Certificat SSL valide sur le domaine de production, redirection HTTP vers HTTPS, renouvellement automatisé.
- Variables d'environnement de production renseignées (`yarn check:environment` vert avec `APP_ENV=production`) et la clé d'envoi des mails testée de bout en bout.
- Pas de base de données ici : la sauvegarde, c'est le dépôt git et la configuration de l'hébergeur, à confirmer avec l'utilisateur.
- Moniteur HTTP externe (Better Stack, UptimeRobot) qui alerte si le site ne répond plus.

## Avant de cocher la dernière case

Dire explicitement à l'utilisateur quelles cases n'ont pas pu être vérifiées depuis cet environnement (GA4, hébergeur, certificat, registrar) plutôt que de les supposer bonnes.
