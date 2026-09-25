---
name: security
description: Sécurité, RGPD et anti-abus du template de site — en-têtes HTTP, tiers appelés, consentement cookies, formulaires publics. À charger AVANT d'ajouter un service tiers, un formulaire, une route API, et dans la checklist de livraison du skill `instructions`.
---

# Sécurité et RGPD — Template de site

## Avertissement

État constaté au 2026-09-25. `next.config.ts` et les services listés ici sont la source de vérité, pas ce document — vérifier le fichier réel du projet courant avant d'affirmer qu'un point est couvert.

## En-têtes HTTP — déjà en place, à ne jamais retirer

`next.config.ts` pose déjà un jeu complet sur `/:path*` : `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Strict-Transport-Security`, `Cross-Origin-Opener-Policy: same-origin`, `poweredByHeader: false`. `X-XSS-Protection` est volontairement absent : les navigateurs l'ignorent depuis 2019 et le filtre qu'il activait était lui-même exploitable, c'est la CSP qui protège du XSS. C'est la référence à répliquer sur tout projet qui n'aurait pas cloné ce fichier tel quel.

Point d'attention non corrigé : `script-src` et `style-src` du CSP contiennent `'unsafe-inline'`, ce qui affaiblit la protection XSS que le CSP est censé apporter (un script injecté inline n'est pas bloqué). C'est un compromis pratique avec l'hydratation Next.js — le durcir en nonce/hash si le projet manipule des données sensibles (paiement, compte utilisateur), sinon l'accepter en connaissance de cause plutôt que de l'oublier.

## Tiers et `connect-src` — la règle qui évite l'audit externe embarrassant

Toute requête que le navigateur déclenche vers un domaine tiers doit être **à la fois** :

1. déclarée dans `connect-src` (ou `script-src`/`frame-src` selon le type) du CSP ;
2. mentionnée dans la page `privacy-policy` (`src/app/[locale]/privacy-policy/page.tsx`).

C'est exactement le type de trou qu'un audit externe a signalé sur un autre projet : un service de géocodage (Komoot/Photon) appelé côté navigateur mais absent de la politique de confidentialité. Avant d'ajouter un service tiers (géocodage, carte, chat, paiement, analytics supplémentaire) : l'ajouter au CSP ET à la page privacy-policy dans le même changement, jamais l'un sans l'autre. Vérifier avec l'onglet Réseau du navigateur en remplissant un vrai formulaire de test, pas seulement en relisant le code — un appel caché dans une lib tierce peut échapper à une simple lecture.

## Consentement cookies — le pattern à répliquer partout

`ConsentService` + `ConsentManager` + `AnalyticsGate` (`src/services/ConsentService.ts`, `src/components/structures/feedback/ConsentManager.tsx`, `src/components/layout/AnalyticsGate.tsx`) implémentent le seul pattern acceptable : **rien de non essentiel ne charge avant un choix explicite**. `AnalyticsGate` ne rend `<GoogleAnalytics>`/`<Analytics>` que si `preferences.analytics` est vrai.

Toute nouvelle intégration qui pose un cookie non essentiel ou charge un script tiers de tracking passe par ce même gate — jamais un `<script>` ajouté directement dans un layout qui charge sans condition.

Refuser tout doit rester aussi simple qu'accepter tout dans `ConsentManager` (pas de bouton "tout accepter" en évidence et "refuser" caché dans un sous-menu).

## Formulaires et endpoints publics — anti-abus

`src/app/api/appointments/route.ts` et `src/app/api/forms/[formId]/route.ts` sont publics, atteignables par un script sans passer par le navigateur. Trois protections, toutes portées par la classe `Route` (`src/structures/Route.ts`), à réutiliser sur toute nouvelle route publique :

- **Limite par IP** : `this.limit(request, 'forms' | 'reads')` compte les requêtes par adresse (`RateLimitService`) et rend un `429` avec `Retry-After`. Budgets dans `src/configurations/system/rateLimit.json` (5 envois et 120 lectures par fenêtre de 10 min). Le compteur vit en mémoire de l'instance : il freine un script, il n'arrête pas une attaque répartie. Sur Vercel, activer en plus le pare-feu de la plateforme (règle de limite sur `/api/*`), ou passer le compteur sur Upstash Redis si le trafic le justifie.
- **Champ piège** : `HoneypotField` (hors écran, hors tabulation) dans `FormRenderer` et `BookingSection`. Rempli, la route répond comme si tout s'était bien passé et n'envoie rien (`this.isTrapped`, `this.withoutTrap`).
- **Validation** : `FormService.isPayloadValid` contre la déclaration du formulaire, avant tout envoi.

Le mail envoyé échappe chaque valeur saisie (`MailService.buildFormPayload`) : ce qu'un visiteur tape reste du texte, jamais du HTML dans la boîte du client.

## RGPD — mentions et pages

- Politique de confidentialité et mentions légales à jour, sans placeholder du template (identité de l'éditeur, hébergeur).
- Formulaire de contact/RDV : mention du traitement des données et moyen d'exercer ses droits.
- Cookie de langue `NEXT_LOCALE` (next-intl 4) : cookie de session, posé seulement quand le visiteur choisit une autre langue que celle de son navigateur. Fonctionnel, donc sans consentement, mais listé dans la politique cookies.
- Aucune donnée personnelle transmise à un tiers avant consentement (couvert par `AnalyticsGate`, à revérifier si un nouveau tiers est ajouté hors analytics).

## Secrets et dépendances

- `.env` n'est jamais suivi par git : `git ls-files | grep -E '^\.env$'` doit être vide. `.env.example` ne contient que des valeurs fictives.
- `yarn npm audit --all --recursive` avant chaque livraison. Une faille `critical` ou `high` se corrige avant la mise en ligne : montée de version dans la même majeure, ou épinglage dans `resolutions` pour une dépendance indirecte. Une montée de majeure se décide à part.
- Aucun doublon de synchronisation iCloud (`Fichier 2.ts`, `dossier 2/`) : `find . -name '* 2*' -not -path './node_modules/*'` doit être vide. Une copie de conflit oubliée diverge sans bruit de la version utilisée.

## Les seize signes d'une app piratable, version site vitrine

La grille complète vit dans le skill `security` des dashboards. Un site vitrine n'a ni base ni session : la plupart des signes ne s'appliquent pas, les voici tranchés pour ce template.

| #      | Signe                                                     | Ici                                                                                                                                                         |
| ------ | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1      | RLS                                                       | Pas de base. Si un projet en ajoute une (Supabase), RLS sur chaque table, sans exception.                                                                   |
| 2-3    | Clé à privilèges dans le bundle, secret en `NEXT_PUBLIC_` | Les clés (mail, Google Calendar) ne sont lues que côté serveur (`src/configurations/admins/`). `NEXT_PUBLIC_` réservé à l'environnement et à l'URL du site. |
| 4      | CORS en étoile                                            | Aucun en-tête CORS : les routes ne servent que le site lui-même.                                                                                            |
| 5      | Jeton en `localStorage`                                   | Pas de jeton. Le `localStorage` ne garde que le consentement et le thème.                                                                                   |
| 6      | Auth côté client seulement                                | Pas d'espace connecté.                                                                                                                                      |
| 7      | Routes sans validation                                    | Chaque route valide contre la déclaration du formulaire (`FormService.isPayloadValid`, `parseISODate`).                                                     |
| 8-10   | Pagination, index, N+1                                    | Sans objet sans base. `CalendarService` fait un seul appel `freeBusy` par jour demandé.                                                                     |
| 11, 13 | Migrations, types régénérés                               | Sans objet.                                                                                                                                                 |
| 12     | `any`                                                     | Interdit par ESLint.                                                                                                                                        |
| 14     | `'use client'` partout                                    | Les sections sont serveur par défaut, le client est limité aux formulaires, au consentement et aux interactions.                                            |
| 15     | `page.tsx` de 800 lignes                                  | Une page assemble des sections déclarées ; aucune ne dépasse 100 lignes.                                                                                    |
| 16     | Zéro rate limit                                           | `this.limit` sur les deux routes publiques (voir plus haut).                                                                                                |

## Ce qui est banni

- Un tiers appelé par le navigateur et absent du CSP ou de la privacy-policy.
- Un script de tracking chargé sans passer par `ConsentService`/`AnalyticsGate`.
- Un endpoint public sans `this.limit` ni champ piège.
- Une valeur saisie par un visiteur insérée telle quelle dans un mail HTML.
- Retirer `'unsafe-inline'` sans tester : ça casse l'hydratation si fait à l'aveugle — le durcir avec un nonce, pas en le supprimant sec.

## Validation

Pas de commande automatisée dédiée. Se vérifie par lecture de `next.config.ts`, test manuel dans l'onglet Réseau avec un formulaire rempli, et relecture de la page privacy-policy à chaque tiers ajouté. À inclure dans la checklist de livraison du skill `instructions` (section 7).
