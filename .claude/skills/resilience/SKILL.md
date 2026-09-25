---
name: resilience
description: Ce qui empêche une app de tomber, de coûter cher ou de mentir à l'utilisateur quand quelque chose rate — limites par utilisateur, plafonds d'appels et de dépenses, écrans d'erreur / chargement / vide, requêtes qui échouent ou n'aboutissent pas, double clic et double paiement, volume chargé, index, pagination, compression et poids des fichiers envoyés, cache, alerte de panne, suivi des erreurs, sauvegarde restaurable. À charger AVANT d'ajouter une route, un appel à un service externe, un envoi de fichier, une liste, un paiement, et dans la checklist de livraison.
---

# Robustesse, site vitrine

Dix-neuf points, rangés en cinq familles. Chacun a une règle, et la section **Dans ce template** en fin de fichier dit où il est posé sur un site vitrine et ce qui ne le concerne pas. Un point ne se coche qu'après l'avoir vu marcher, pas après avoir lu le code.

## Limiter et plafonner

**1. Limiter les requêtes par utilisateur.** Un compteur par fenêtre de temps (Redis `INCR` + `EXPIRE`), par compte sur les routes connectées, par IP sur les routes publiques. Budgets distincts en lecture et en écriture, plus serrés sur la connexion, la demande de mot de passe et les formulaires publics. Réponse `429` avec un message qui dit quand réessayer. Si Redis est absent, la limite laisse passer et journalise : elle ne bloque jamais tout le monde.

**2. Plafonner les appels API sortants.** Tout appel à un service tiers (mail, calendrier, IA, géocodage, Discord) passe par un seul client par service, avec un délai maximal, un nombre de tentatives borné avec attente croissante, et une file quand le volume peut monter. Jamais un appel tiers déclenché une fois par ligne d'une liste.

**3. Plafonner les dépenses chez les fournisseurs.** Ça ne se règle pas dans le code : c'est une case dans la console de chaque fournisseur payant à l'usage (limite mensuelle chez Anthropic / OpenAI, alerte de budget Google Cloud, plafond Vercel / Resend / Twilio / Better Stack…). À faire à la création du compte, noter le plafond posé dans la section du dépôt. Une clé sans plafond est une facture sans fond si elle fuite.

## Ce que voit l'utilisateur

**4. Un message quand ça plante.** `error.tsx` sur les segments qui en ont besoin, `global-error.tsx` à la racine, `not-found.tsx`. Un échec de mutation s'affiche en toast ou sous le champ, jamais une console muette. Le message dit ce qui s'est passé et quoi faire, sans jargon, sans excuses.

**5. Un chargement plutôt qu'un écran blanc.** `loading.tsx` ou squelette qui occupe la place finale (pas de saut de mise en page à l'arrivée des données). Bouton qui montre qu'il travaille.

**6. Un cas où il n'y a rien à afficher.** Chaque liste a son état vide, distinct de l'état d'erreur : « rien encore » invite à agir, « aucun résultat pour ce filtre » propose de le retirer.

**7. Gérer les requêtes qui échouent.** Côté client : erreur typée, message lisible, bouton « Réessayer » sur un chargement raté, pas de retry automatique sur une écriture. Côté serveur : une erreur attendue devient une réponse propre (4xx avec message), une exception devient un 500 journalisé, jamais une pile d'appels renvoyée au navigateur.

**8. Gérer les APIs qui ne répondent pas.** Aucune requête sans délai maximal : `AbortSignal.timeout(ms)` sur un `fetch` serveur, `timeout` sur Axios, délai déclaré dans la configuration du projet, pas en dur. Au-delà, message « le serveur met trop de temps » et possibilité de réessayer.

## Ne rien faire deux fois

**9. Empêcher le double clic sur envoyer.** Le bouton d'envoi est désactivé et affiche un indicateur tant que la requête est en cours (`loading={mutation.isPending}`, `useFormStatus().pending`, ou état local). Vaut pour chaque formulaire, chaque bouton « Confirmer ».

**10. Empêcher le double paiement.** Côté prestataire : clé d'idempotence sur chaque création de paiement (`Idempotency-Key` chez Stripe, dérivée de la commande, pas aléatoire à chaque clic). Côté base : contrainte d'unicité sur la référence de paiement. Côté webhook : l'événement déjà traité est ignoré (identifiant d'événement stocké). Le bouton de paiement suit le point 9.

## Charger peu

**11. Charger seulement ce qui s'affiche.** `select` des seuls champs rendus, pas de relation incluse « au cas où », composants lourds sous `next/dynamic`, images hors écran en lazy.

**12. Des index pour accélérer les recherches.** Voir le signe 9 du skill `security` : chaque colonne filtrée ou triée souvent est indexée. Vérifier avec `EXPLAIN ANALYZE` une requête lente avant d'ajouter un index au hasard.

**13. Découper les longues listes en pages.** Pagination serveur (`take` / `skip` ou curseur) avec une taille par défaut déclarée en configuration. Jamais tout rapatrier pour trancher en JavaScript.

**14. Compresser automatiquement les fichiers envoyés.** Une image est redimensionnée à sa taille d'affichage maximale et réencodée (WebP) côté serveur avant stockage (`sharp`), ce qui retire aussi les métadonnées EXIF (position GPS d'une photo de téléphone). Un PDF est stocké tel quel.

**15. Limiter le poids des fichiers envoyés.** Taille maximale et types acceptés déclarés en configuration, vérifiés **côté serveur** (le client peut mentir) et rappelés côté client pour éviter un envoi inutile. Nombre de fichiers par champ borné aussi.

**16. Garder en mémoire ce qui ne change pas.** Données lues souvent et écrites rarement (gabarits, référentiels, réglages) en cache avec invalidation à l'écriture ; fichiers statiques et images servis avec un `Cache-Control` long et une URL versionnée. On ne cache que ce dont on voit toutes les écritures.

## Savoir quand ça casse

**17. Une alerte automatique si le site tombe.** Un moniteur **externe** (Better Stack, UptimeRobot) qui appelle `/api/health` ou la page d'accueil toutes les minutes et prévient par mail / SMS / Discord. Un battement envoyé par l'app elle-même ne suffit pas : si le serveur est éteint, il ne bat plus, et c'est l'absence de battement qui doit alerter (heartbeat avec délai de grâce).

**18. Une trace de chaque erreur.** Sentry (ou équivalent) branché côté serveur, edge **et** navigateur, avec l'environnement et la version de l'app. Un logger central plutôt que des `console.error` épars. Aucune donnée personnelle ni secret dans les traces.

**19. Vérifier que la sauvegarde se restaure.** Une sauvegarde jamais restaurée n'est pas une sauvegarde. Sauvegarde automatique chez l'hébergeur de la base, et au moins une fois par mois (et avant chaque livraison) : restaurer dans une base jetable, comparer le nombre de lignes par table et la dernière migration, puis supprimer la base jetable.

## Vérification rapide

```bash
grep -rliE "rate.?limit|throttle" src                                  # 1
grep -rnE "fetch\(|axios\.create" src | grep -v test                   # 2, 8 : chacun a un délai ?
find src/app -name "error.tsx" -o -name "global-error.tsx" -o -name "loading.tsx" -o -name "not-found.tsx"   # 4, 5
grep -rlE "EmptyState|empty" src/components | head                     # 6
grep -rnE "type=\"submit\"|onClick=\{(submit|save|send)" src --include='*.tsx' | grep -vE "loading|disabled|pending"   # 9 : doit être vide
grep -rniE "idempoten" src                                             # 10, si paiement
grep -rnE "maxBytes|MAX_FILE|maxFileSize|bodySizeLimit" src next.config.*   # 15
grep -rnE "sharp|compressImage" src                                    # 14
ls sentry.*.config.* src/instrumentation*.ts 2>/dev/null               # 18
```

## Dans ce template

État relevé le 2026-09-24. Un site vitrine n'a ni base ni compte : plusieurs points tombent, ceux qui restent tiennent surtout aux deux routes publiques et aux tiers (mail, Google Calendar).

| #     | État                                                                                                                                                                                                                                        | Où                                                            |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 1     | `this.limit(request, bucket)` sur `/api/forms/[formId]` et `/api/appointments`, par IP, budgets dans `system/rateLimit.json`, `429` + `Retry-After`. En mémoire par instance : ajouter la règle de pare-feu de la plateforme en production. | `src/structures/Route.ts`, `src/services/RateLimitService.ts` |
| 2     | Tiers appelés par un seul service chacun (`MailService`, `CalendarService`), tous via `HttpService`.                                                                                                                                        | `src/services/`                                               |
| 3     | À poser dans la console du fournisseur de mail (quota journalier) et de Google Cloud (quota de l'API Calendar) pour chaque client.                                                                                                          |                                                               |
| 4     | `[locale]/error.tsx`, `global-error.tsx`, `not-found.tsx` traduits.                                                                                                                                                                         | `src/app/`                                                    |
| 5     | `[locale]/loading.tsx`, `Spinner` pendant la lecture des créneaux.                                                                                                                                                                          |                                                               |
| 6     | `EmptyState` (jour sans créneau, page introuvable).                                                                                                                                                                                         |                                                               |
| 7-8   | `HttpService` : délai `system/http.json` (`requestTimeoutMs`, 15 s), erreurs typées `errors.timeout` / `errors.network` traduites.                                                                                                          | `src/services/HttpService.ts`                                 |
| 9     | `FormRenderer` et `BookingSection` désactivent le bouton pendant l'envoi.                                                                                                                                                                   |                                                               |
| 10    | Pas de paiement.                                                                                                                                                                                                                            |                                                               |
| 11-13 | Sans objet (pas de liste serveur).                                                                                                                                                                                                          |                                                               |
| 14-15 | Pas d'envoi de fichier. Images du site servies par `next/image` (formats modernes, tailles adaptées).                                                                                                                                       |                                                               |
| 16    | Pages statiques ou mises en cache par Next, fichiers de `public/` à nom versionné quand ils changent.                                                                                                                                       |                                                               |
| 17    | À créer pour chaque client : moniteur HTTP externe (Better Stack, UptimeRobot) sur la page d'accueil.                                                                                                                                       |                                                               |
| 18    | `LoggerService` côté serveur. Pas de Sentry dans le template : à brancher quand le client a des formulaires critiques.                                                                                                                      | `src/services/LoggerService.ts`                               |
| 19    | Sans base, rien à restaurer ; le dépôt git et l'hébergeur portent le site.                                                                                                                                                                  |                                                               |
