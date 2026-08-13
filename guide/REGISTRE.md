# Registre des fonctionnalités

Une entrée par système livré avec le template. Pour chacun : les fichiers qui le composent, les variables qu'il expose, les clés de traduction qu'il consomme, et le geste exact pour l'étendre.

**Toute nouvelle fonctionnalité s'ajoute ici le jour où elle est écrite.** Une fonctionnalité absente de ce registre est considérée comme non livrée.

---

## 1. Thème clair, sombre et système

|                   |                                                          |
| ----------------- | -------------------------------------------------------- |
| **Service**       | `src/services/ThemeService.ts`                           |
| **Configuration** | `src/configurations/theme.json`                          |
| **Composants**    | `src/components/structures/navigation/ThemeSwitcher.tsx` |
| **Consommé par**  | `src/app/[locale]/layout.tsx`, `tailwind.config.ts`      |
| **Drapeau**       | `features.json → themeSwitcher`                          |

**Variables** — `ThemeService.modes`, `ThemeService.defaultMode`, `buildStyleSheet()`,
`buildBootScript()`, `readMode()`, `select(mode)`, `apply(mode)`, `watchSystem(onChange)`,
`resolveScheme(mode)`.
**Types** — `ThemeMode` (`light | dark | system`), `ThemeScheme`, `ColorName`, `RadiusName`.
**Clés i18n** — `navigation.theme.light|dark|system`.
**Attribut DOM** — `data-theme` sur `<html>`, posé avant la première peinture par le script d'amorçage.

**Ajouter une couleur** : une entrée dans `theme.json → colors.light` **et** `colors.dark`. Tailwind la lit au build, l'atlas l'affiche, la variable CSS `--color-<nom>` est générée. Aucun autre fichier.

---

## 2. Internationalisation

|                   |                                                                   |
| ----------------- | ----------------------------------------------------------------- |
| **Service**       | `src/services/I18nService.ts`                                     |
| **Configuration** | `src/configurations/localization.json`                            |
| **Câblage**       | `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/middleware.ts` |
| **Composants**    | `src/components/structures/navigation/LanguageSwitcher.tsx`       |
| **Textes**        | `messages/<locale>.json`                                          |
| **Drapeau**       | `features.json → languageSwitcher`                                |

**Variables** — `I18nService.locales`, `defaultLocale`, `localePrefix`, `isSupported()`, `resolve()`,
`alternatesOf()`, `flagOf(locale)`, `languageNameOf(locale)`, `loadMessages()`.
**Règle** — un composant importe `Link`, `usePathname`, `useRouter` depuis `@/i18n/routing`, jamais depuis `next/link` ni `next/navigation`.

**Sélecteur** — `LanguageSwitcher` rend un `<select>` natif plutôt qu'un lien par langue alternative,
pour passer à l'échelle au-delà de deux langues. `flagOf()` calcule l'emoji drapeau à partir d'un code
région ISO (`localization.json → regions`, mapping locale → région) ; `languageNameOf()` lit le nom
natif de la langue via `Intl.DisplayNames`. Changer de langue appelle `router.replace(pathname,
{ locale })` de `@/i18n/routing`, donc reste sur la même route. Styles dans `LANGUAGE_SWITCHER_STYLES`
(voir §15).

**Ajouter une langue** : le code dans `localization.json → locales`, son code région dans `regions`,
puis `messages/<code>.json`. Le routage, le sélecteur, le sitemap et les balises `alternate` suivent
seuls.

---

## 3. Routes et navigation

|                   |                                                                          |
| ----------------- | ------------------------------------------------------------------------ |
| **Déclaration**   | `src/declarations/routes.ts` (`ROUTES`, `SECTION_ANCHORS`)               |
| **Service**       | `src/services/NavigationService.ts`                                      |
| **Configuration** | `src/configurations/navigation.json`                                     |
| **Composants**    | `NavigationList`, `Breadcrumb`, `SiteHeader`, `SiteFooter`, `ActionLink` |

**Variables** — `pathOf(id)`, `keyOf(id)`, `declarationOf(id)`, `anchorOf(anchor)`, `mailtoOf(email)`,
`telOf(phone)`, `buildEntries()`, `headerEntries()`, `footerColumns()`, `callToActionRoute()`,
`ctaActionOf(id)`, `breadcrumbOf()`, `indexableRoutes()`.
**Types** — `RouteId`, `RouteDeclaration` (`path`, `icon?`, `indexable?`, `ctaAction?`), `NavigationEntry`,
`BreadcrumbEntry`.
**Clés i18n** — `routes.<routeId>.label`, `.metaTitle`, `.metaDescription`.
**CTA d'une route** — `ctaAction` (type `ActionName`, voir §25) donne le libellé à afficher quand la
route sert de cible de CTA (`HeroSection`, `CallToActionSection`, `PricingSection`,
`StickyActionBar`) : c'est volontairement une formule différente de `routes.<id>.label` (ex.
« Nous contacter » contre « Contact »). `ctaActionOf(id)` le lit et journalise un avertissement avec
repli sur `actions.submit` si une route est utilisée comme CTA sans `ctaAction` déclaré — un composant
ne doit jamais passer un `RouteId` brut à `useTranslations('actions')`.

**Ajouter une page** :

1. une entrée dans `ROUTES` (`path`, `icon`, `indexable` si elle doit sortir du sitemap) ;
2. le dossier correspondant sous `src/app/[locale]/` avec son `page.tsx` ;
3. le bloc `routes.<routeId>` dans **chaque** fichier de `messages/` ;
4. l'identifiant dans `navigation.json` si elle doit apparaître dans l'en-tête ou le pied de page.

Le sitemap, les métadonnées, le fil d'Ariane et le libellé du lien se déduisent seuls.

---

## 4. Métadonnées, sitemap et robots

|                     |                                                             |
| ------------------- | ----------------------------------------------------------- |
| **Service**         | `src/services/SeoService.ts`                                |
| **Configuration**   | `src/configurations/seo.json`, `site.json`, `identity.json` |
| **Routes générées** | `src/app/sitemap.ts`, `src/app/robots.ts`                   |

**Variables** — `buildMetadata({ routeId, locale, translate })`, `buildRootMetadata()`,
`buildOrganizationSchema(locale)`, `absoluteUrlOf(locale, path)`.
**Règle** — une page n'écrit jamais son `<title>` ; elle exporte `generateMetadata` qui délègue à `SeoService.buildMetadata`.

---

## 5. Formulaires déclaratifs

|                 |                                                                           |
| --------------- | ------------------------------------------------------------------------- |
| **Déclaration** | `src/declarations/forms.ts` (`FORMS`, `FIELD_TYPES`, `FIELD_INPUT_TYPES`) |
| **Services**    | `src/services/FormService.ts`, `src/services/ValidationService.ts`        |
| **Composants**  | `Field.tsx`, `FieldControl.tsx`, `FormRenderer.tsx`                       |
| **Route API**   | `src/app/api/forms/[formId]/route.ts`                                     |
| **Envoi**       | `src/services/MailService.ts`                                             |
| **Drapeau**     | `features.json → contactForm`                                             |

**Variables** — `FormService.declarationOf(id)`, `buildInitialState()`, `setValue()`, `touchField()`,
`submit()`, `isPayloadValid()`.
**Types** — `FormDeclaration`, `FieldDeclaration`, `FieldType`, `FieldValue`, `FormState`,
`FormStatus`, `FieldError`, `FormErrors`.
**Clés i18n** — `forms.<formId>.success`, `forms.<formId>.fields.<champ>.label|placeholder|hint|choice`,
`forms.<formId>.fields.<champ>.options.<valeur>`, `actions.<submitAction>`.

**Ajouter un formulaire** : une entrée dans `FORMS` et un bloc dans `messages/`. Le rendu, la
validation côté visiteur, la revalidation côté serveur et l'envoi passent par l'existant. Aucune
nouvelle route API, aucun nouveau composant. `submitAction` est typé `ActionName` (§25) : sa valeur
doit exister dans `ACTIONS`, sinon `FORMS` échoue à la vérification de type.

**Rediriger après succès** : `redirectRouteId` (optionnel, type `FormDeclaration`) pointe vers un
`RouteId`. `FormRenderer` navigue vers ce chemin via `useRouter` de `@/i18n/routing` au lieu d'afficher
l'`Alert` de succès inline. Sans ce champ, le comportement inline existant ne change pas — voir §30
pour la page de remerciement livrée avec le template, utilisée par le formulaire `contact`.

**Ajouter un type de champ** : une entrée dans `FIELD_TYPES`, une branche dans `FieldControl`, et
si le champ est un `input`, une entrée dans `FIELD_INPUT_TYPES`.

---

## 6. Validation

|                   |                                                                   |
| ----------------- | ----------------------------------------------------------------- |
| **Déclaration**   | `src/declarations/validation.ts` (`PATTERNS`, `VALIDATION_RULES`) |
| **Configuration** | `src/configurations/system/validation.json` (`limits`)            |
| **Service**       | `src/services/ValidationService.ts`                               |

**Variables** — `validateField(field, value)`, `validateForm(form, values)`, `buildInitialValues(form)`.
**Retour** — `FieldError { rule, params }`, jamais une phrase : le message vient de
`validation.<rule>` et reçoit `{ count }`.
**Règle** — les mêmes règles tournent dans le navigateur et dans la route API, une seule fois écrites.

---

## 7. Notifications transitoires

|               |                                                             |
| ------------- | ----------------------------------------------------------- |
| **Service**   | `src/services/NotificationService.ts`                       |
| **Composant** | `src/components/structures/feedback/NotificationRegion.tsx` |
| **Drapeau**   | `features.json → notifications`                             |

**Variables** — `success(key, params)`, `error()`, `info()`, `warning()`, `dismiss(id)`, `use()`.
**Règle** — l'appelant passe une **clé de traduction complète**, jamais un texte.
**Durée de vie** — `notificationLifetimeMs`, cinq secondes, déclarée dans
`configurations/system/timings.json`.

---

## 8. Requêtes réseau

|                   |                                                            |
| ----------------- | ---------------------------------------------------------- |
| **Déclaration**   | `src/declarations/http.ts`                                 |
| **Configuration** | `src/configurations/system/http.json` (`requestTimeoutMs`) |
| **Service**       | `src/services/HttpService.ts`                              |

**Variables** — `request<T>(path, options)`, `post<T>(path, body, options)`.
**Types** — `RequestOptions`, `RequestResult<T>`, `RequestFailure`, `HttpMethod`.
**Règle** — `HttpService` est le seul module autorisé à appeler `fetch`. Il ne lève jamais : il rend
`{ success: false, error }`, l'erreur portant une clé sous `errors.`.
**Délai** — `requestTimeoutMs`, quinze secondes, déclaré dans `configurations/system/http.json`.
**Corps `form`-encodé** — `RequestOptions.form` (`Record<string, string>`) bascule le `Content-Type`
sur `application/x-www-form-urlencoded` au lieu du JSON par défaut de `body`. Nécessaire pour un
endpoint OAuth/token classique (`CalendarService`, voir §37, en est le premier consommateur).

---

## 9. Stockage navigateur

|                   |                                                     |
| ----------------- | --------------------------------------------------- |
| **Déclaration**   | `src/declarations/analytics.ts` (`STORAGE_KEYS`)    |
| **Configuration** | `src/configurations/system/storage.json` (`prefix`) |
| **Service**       | `src/services/StorageService.ts`                    |

**Variables** — `buildKey(name)`, `read<T>(name)`, `write<T>(name, value)`, `clear(name)`.
**Règle** — seul module autorisé à toucher `localStorage`. Toute clé est préfixée, tout échec
retourne `null` au lieu de lever.

---

## 10. Analytique et journalisation

|                   |                                                                     |
| ----------------- | ------------------------------------------------------------------- |
| **Déclaration**   | `src/declarations/analytics.ts` (`ANALYTICS_EVENTS`, `LOG_LEVELS`)  |
| **Services**      | `src/services/AnalyticsService.ts`, `src/services/LoggerService.ts` |
| **Environnement** | `NEXT_PUBLIC_ANALYTICS_ENABLED`                                     |
| **Drapeau**       | `features.json → analytics`                                         |

**Variables** — `AnalyticsService.track(event, properties)`, `LoggerService.debug|info|warn|error(scope, payload)`.
**Règle** — `LoggerService` est le seul module autorisé à appeler la console ; un scope est toujours
passé. Le nom d'événement envoyé est le `snake_case` dérivé par `NamingService`.

**Google Analytics (GA4)** — `<GoogleAnalytics gaId={...} />` de `@next/third-parties/google`, monté
par `AnalyticsGate` (§33), à côté de `@vercel/analytics`. Piloté par le même drapeau
`features.json → analytics` et par `ConfigurationService.environment.analytics.googleAnalyticsId`
(sujet `analytics`, variable `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`, voir §23). Un identifiant vide
désactive le composant : un clone frais du template ne charge aucun script Google.
**Consentement** — ni `<Analytics />` ni `<GoogleAnalytics>` ne se montent avant que
`ConsentService.use()` rende `'granted'` : voir §33 pour le bandeau et le mécanisme de blocage.

---

## 11. Formatage des valeurs

|                     |                                                              |
| ------------------- | ------------------------------------------------------------ |
| **Fonctions pures** | `src/utils/format/date.ts`, `number.ts`, `strings.ts`        |
| **Service**         | `src/services/FormatService.ts`                              |
| **Configuration**   | `localization.json → timeZone`, `currency`, `firstDayOfWeek` |

**Variables** — `FormatService.for(locale)` rend `{ number, currency, currencyParts, percent, bytes,
date, relative, weekdays, months }`.
**Règle** — les `utils/` restent purs et reçoivent leur locale ; seul `FormatService` connaît les
valeurs par défaut. Un montant est **toujours** stocké en centimes.
**Presets de date** — `short`, `long`, `monthYear`, `dayMonth`, `weekday`, `time`, `dateTime`.

---

## 12. Viewport et points de rupture

|                   |                                                                           |
| ----------------- | ------------------------------------------------------------------------- |
| **Configuration** | `src/configurations/system/viewport.json` (`breakpoints`, `mediaQueries`) |
| **Consommé par**  | `HeroSection`, `ScrollToTop`, `Picture`, `ThemeService`                   |

**Règle** — un composant ne rédige jamais une requête média en dur ; il lit un point de rupture nommé
dans `ConfigurationService.viewport.breakpoints`/`.mediaQueries`. Aucun service dédié n'existe : ce
sont des nombres et des chaînes lus directement, pas un état à observer. Un besoin réel d'écoute
`matchMedia` réactive (media query qui change pendant la session) redeviendrait un service — voir
`services/core/StoreService.ts` pour le patron à suivre le jour où un troisième composant en aura
besoin.

---

## 13. Défilement

|                |                                             |
| -------------- | ------------------------------------------- |
| **Service**    | `src/services/ScrollService.ts`             |
| **Composants** | `ScrollToTop`, `SiteHeader`, `OverlayShell` |
| **Drapeau**    | `features.json → scrollToTop`               |

**Variables** — `use()` rend `{ offset, isScrolled, direction }`, `toTop()`, `toAnchor(anchor)`,
`lock()` rend la fonction de relâchement.
**Seuils** — `scrollThresholdPx` (8 px), déclaré dans `configurations/system/timings.json` ;
`ScrollToTop` réutilise `breakpoints.sm` de `configurations/system/viewport.json` (640 px).
**Règle** — `lock()` compte les appelants, deux superpositions imbriquées ne se marchent pas dessus.

---

## 14. État partagé

|              |                                     |
| ------------ | ----------------------------------- |
| **Fabrique** | `src/services/core/StoreService.ts` |

**Variables** — `createStore(initialState, { activate })` rend `{ getState, setState, subscribe, use }`.
**Règle** — `activate` est appelé au premier abonné et démonté au dernier : un service n'a pas besoin
de fournisseur React pour brancher ses écouteurs.
**Attention** — `StoreService` importe React ; un service qui l'utilise ne doit donc être importé que
depuis des composants client. C'est pourquoi `ThemeService`, lu par le layout serveur, n'a pas d'état.

---

## 15. Design system

|                       |                                   |
| --------------------- | --------------------------------- |
| **Jetons**            | `src/declarations/ui/tokens.ts`   |
| **Variantes**         | `src/declarations/ui/variants.ts` |
| **Icônes**            | `src/declarations/ui/icons.ts`    |
| **Polices**           | `src/declarations/ui/fonts.ts`    |
| **Fusion de classes** | `src/utils/classnames.ts` (`cn`)  |

**Registres partagés** — `TONES`, `SIZES`, `TONE_TEXT`, `TONE_SOFT`, `TONE_SOLID`, `TONE_BORDER`,
`SURFACES` (dont `glass`, un fond glassmorphism qui s'appuie sur `.surface-glass` dans `globals.css`
et `theme.json → shadows.glass`), `GRID_COLUMNS`, `CONTAINER_WIDTHS` (dont `wide`, `max-w-wide`, pour
un contenu plus large que `default`), `SECTION_SPACING`, `GAPS`, `ALIGNMENTS`, `LAYERS`, `FOCUS_RING`,
`TRANSITION`, `DISABLED`, `UNDERLINE`/`UNDERLINE_ACTIVE` (soulignement animé au survol, `scale-x` sur
pseudo-élément `after`), `MOTION` (voir §35).
**Variantes par composant** — `BUTTON_*`, `BADGE_*`, `TEXT_STYLES`, `HEADING_STYLES`, `FIELD_STYLES`,
`SKELETON_*`, `EMPTY_STATE_STYLES`, `ALERT_STYLES`, `OVERLAY_STYLES`, `DRAWER_STYLES`,
`ACCORDION_STYLES`, `TABS_STYLES`, `TABLE_STYLES`, `NAVIGATION_STYLES`, `FOOTER_STYLES`,
`CARD_STYLES`, `STAT_STYLES`, `TOAST_STYLES`, `LAYOUT`, `ACTION_ICON_SIZES`,
`ICON_BUTTON_ICON_SIZES`, `AVATAR_PIXELS`, `LANGUAGE_SWITCHER_STYLES`, `CONSENT_STYLES` (§33),
`BOOKING_STYLES` (§37), `COMPARISON_STYLES` (§19), `TEXTURE_BACKDROP_STYLES` (§36).
**Aide** — `buttonClass({ variant, size, fullWidth })`, partagée par `Button` et `ActionLink`.

**Ajouter une variante de bouton** : une entrée dans `BUTTON_VARIANTS`. Elle apparaît dans l'atlas,
elle est utilisable par `Button` et `ActionLink`, aucun autre fichier ne change.

**Ajouter une icône** : l'import et une entrée dans `ICONS`. Le composant `Icon` et l'atlas suivent.

**`tailwind.config.ts`** — `height` et `minHeight` sont générés depuis `theme.json → layout`, comme
`maxWidth` (une classe `h-<nom>`/`min-h-<nom>` par clé). Registre d'animations Tailwind : `fade-in`,
`slide-up`, `slide-left`, `shimmer`, `rise` (entrée discrète), `shine` (bande lumineuse traversante, à combiner
avec un `background-image` en dégradé sur l'élément qui la porte), `drift` (flottement vertical
léger), `marquee` (défilement en boucle, voir §35). Chaque durée non triviale vient de
`configurations/system/timings.json`
(`shineDurationMs`, `driftDurationMs`, `marqueeDurationMs`, `carouselIntervalMs`), jamais écrite en
dur dans `tailwind.config.ts`.

---

## 16. États d'attente et états vides

|                |                                                                                         |
| -------------- | --------------------------------------------------------------------------------------- |
| **Composants** | `Skeleton`, `SkeletonList`, `PageSkeleton`, `Spinner`, `EmptyState`, `EmptyStateFigure` |
| **Variantes**  | `SKELETON_SHAPES`, `PAGE_SKELETON_STYLES`, `EMPTY_STATE_STYLES`, `SPINNER_SIZES`        |

**Variables** — `SkeletonShape` (`line`, `title`, `text`, `row`, `card`, `avatar`, `button`),
`EmptyStateVariant` (`start`, `filter`), `EmptyStateFigureName` (`documents`, `search`, `message`).
**Clés i18n** — `feedback.loading`, `feedback.empty.title|description`.

---

## 17. Superpositions

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| **Base partagée** | `src/components/structures/overlays/OverlayShell.tsx` |
| **Composants**    | `Modal`, `Drawer`, `Accordion`, `Tooltip`             |

**Comportement mutualisé** — portail, voile, touche d'échappement, gel de la page. `Modal` et `Drawer`
n'en réimplémentent rien.
**Clés i18n** — `actions.close`, `actions.open`.

---

## 18. Collections

|                     |                                        |
| ------------------- | -------------------------------------- |
| **Composants**      | `DataTable`, `FilterBar`, `Pagination` |
| **Fonctions pures** | `src/utils/array.ts`                   |

**Variables** — `buildPaginationMeta(total, page, perPage)`, `selectPage(items, meta)`, `chunk`,
`groupBy`, `sortBy`, `uniqueBy`.
**Types** — `TableColumn<T>`, `PaginationMeta`, `Paginated<T>`, `FilterOption`.
**Clés i18n** — `feedback.pagination`, `actions.previous|next|search`.
**Règle** — `DataTable` reçoit ses colonnes en déclaration, jamais en markup.

---

## 19. Sections de page

|                |                                                                                                                                                                                                                         |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Composants** | `HeroSection`, `FeatureSection`, `StatsSection`, `GallerySection`, `ComparisonSection`, `PricingSection`, `BookingSection`, `TestimonialSection`, `FaqSection`, `CallToActionSection`, `ContactSection`, `LegalSection` |
| **Catalogue**  | `src/declarations/content.ts`, sauf `pricing` (voir plus bas)                                                                                                                                                           |
| **Enveloppe**  | `src/components/structures/layout/Section.tsx`                                                                                                                                                                          |

**Variables** — chaque section accepte `items` et retombe sur le catalogue du template.
**Types** — `FeatureItem`, `StatItem`, `MediaItem`, `ImageAsset`, `ComparisonItem`, `PricingItem`,
`TestimonialItem`, `FaqItem`, `TimelineItem`.
**Clés i18n** — `sections.<section>.overline|title|description`, puis `sections.<section>.items.<id>.*`.
**Ancres** — `SECTION_ANCHORS` dans `declarations/routes.ts`.

**Catalogue de prix** — `PRICING` vit dans `src/configurations/pricing.json` (donnée de projet), pas
dans `declarations/content.ts` : `ConfigurationService.pricing` l'expose, typé `PricingItem[]`.
`PricingSection` y retombe par défaut. Toute autre liste de la page d'accueil (`FEATURES`, `STATS`,
`GALLERY`, `COMPARISONS`, `TESTIMONIALS`, `FAQ`) reste dans `declarations/content.ts`, ce sont des
listes structurelles de démonstration, pas une tarification.

**Comparaison avant/après** — `ComparisonSection` (ancre `comparisons`) rend un carrousel de paires
d'images comparées côte à côte : défilement tactile par `scroll-snap`, pastilles de navigation,
défilement automatique (`timings.json → carouselIntervalMs`) mis en pause au survol/focus et coupé
sous `prefers-reduced-motion` (écoute locale de `configurations/system/viewport.json →
mediaQueries.reducedMotion` via `matchMedia`, l'état local n'a pas justifié un service pour un seul
consommateur — voir §12). Catalogue `COMPARISONS`
dans `declarations/content.ts`, type `ComparisonItem` (`before`/`after`, chacun un `ImageAsset`
`{ src, width, height }`). `Picture` accepte une prop `stretch` pour remplir le panneau au lieu de
tenir un ratio fixe. Styles dans `COMPARISON_STYLES` (§15). Générique par construction : le nom, les
libellés et le contenu de démonstration ne présument d'aucun métier — un projet dérivé remplace
`COMPARISONS` par ses propres paires (rénovation, remise en forme, immobilier...).

---

## 20. Pages légales

|                 |                                                     |
| --------------- | --------------------------------------------------- |
| **Déclaration** | `LEGAL_SECTIONS` dans `src/declarations/content.ts` |
| **Composant**   | `src/components/sections/LegalSection.tsx`          |
| **Données**     | `src/configurations/identity.json`                  |

**Variables interpolables** — `legalName`, `email`, `phone`, `address`, `registration`, `vat`,
`hostingName`, `hostingAddress`, `publisherName`, `publisherEmail`.
**Clés i18n** — `legal.<page>.sections.<id>.title|body`.

**Ajouter un paragraphe** : un identifiant dans `LEGAL_SECTIONS` et le bloc de traduction. Le rendu
et l'interpolation suivent.

---

## 21. Atlas visuel

|                |                                                                                   |
| -------------- | --------------------------------------------------------------------------------- |
| **Route**      | `/showcase`                                                                       |
| **Composants** | `ShowcaseCatalog`, `ShowcaseBlock`, `ThemePalette`, `TypographyScale`, `IconGrid` |

**Règle** — l'atlas **lit les registres**, il ne recopie pas d'échantillons. Une couleur, une icône,
un style de texte ou une variante de bouton ajoutés y apparaissent sans modifier une seule ligne de
l'atlas. C'est ce qui garantit qu'il reste vrai.

---

## 22. Envoi de courriel

|                   |                                        |
| ----------------- | -------------------------------------- |
| **Service**       | `src/services/MailService.ts`          |
| **Environnement** | `MAIL_API_KEY`, `MAIL_FROM`, `MAIL_TO` |

**Variables** — `isConfigured()`, `send(payload)`, `buildFormPayload(formId, values)`.
**Règle** — sans clé d'API, le service reste en marche à vide : il journalise et rend un succès, si bien qu'un clone frais du template fonctionne sans configuration.
**Contrainte** — importé uniquement côté serveur (`import 'server-only'`).

---

## 23. Environnements et infrastructure

|                   |                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------- |
| **Déclaration**   | `src/declarations/environments.ts` (`ENVIRONMENT_REGISTRY`, `CONFIG_SUBJECTS`)     |
| **Types**         | `src/types/environment.ts`                                                         |
| **Services**      | `src/services/EnvironmentService.ts`, `src/services/ConfigurationService.ts`       |
| **Configuration** | `src/configurations/admins/environments/`, `admins/defaults/`, `admins/templates/` |
| **Script**        | `scripts/check-environment.mjs`                                                    |

**Quatre environnements, un par branche** — `development` ↔ `dev`, `staging` ↔ `staging`, `release` ↔
`release`, `production` ↔ `main`. La correspondance vit une seule fois dans `ENVIRONMENT_REGISTRY`.

**Résolution** — `EnvironmentService.current` est tranché une fois par processus, dans cet ordre :
`APP_ENV` (clé ou nom de branche), `NEXT_PUBLIC_APP_ENV`, puis `NODE_ENV === 'production'`. Un
déploiement qui n'a pas posé `APP_ENV` retombe donc sur `production`, l'environnement le plus strict.

**Sujets de configuration** — `site`, `analytics`, `mail`, `seo`, `calendar`. Chacun a huit fichiers :
quatre `admins/defaults/<sujet>/<sujet>.<environnement>.json` (valeurs de repli littérales) et quatre
`admins/templates/<sujet>/<sujet>.<environnement>.json` (uniquement des liaisons `"${VARIABLE}"`,
jamais une valeur en dur). `ConfigurationService.environment.<sujet>` rend la valeur résolue et
typée ; un type d'environnement invalide journalise un avertissement et retombe sur le défaut.
Le sujet `analytics` porte `enabled` (`NEXT_PUBLIC_ANALYTICS_ENABLED`) et `googleAnalyticsId`
(`NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`, chaîne vide par défaut sur les huit fichiers). Le sujet `calendar`
porte les identifiants Google Calendar du module de rendez-vous (§37), vides par défaut : voir
`scripts/check-environment.mjs`, qui duplique `CONFIG_SUBJECTS` en JavaScript brut pour tourner sans
runtime TypeScript, donc à tenir à jour à la main en même temps que `declarations/environments.ts`.

**Variables** — `ConfigurationService.environment.current`, `.manifest`, `.site`, `.analytics`,
`.mail`, `.seo`, `.calendar`, `.absoluteUrl(path)`.
**Règle** — `EnvironmentService` est le seul module autorisé à lire `process.env` ; il expose
`read(name)` pour toute variable nommée. `ConfigurationService` reste le seul à importer un fichier de
`configurations/`, y compris `admins/defaults/` et `admins/templates/`.
**Bascule SEO** — `admins/defaults/seo/seo.<environnement>.json → noindex` force le désindexage en
dehors de `production`, lu par `SeoService.buildMetadata` et `src/app/robots.ts`.

**Ajouter un sujet** : les huit fichiers `defaults`/`templates`, une entrée dans `CONFIG_SUBJECTS`, son
interface dans `types/environment.ts`, sa fonction `read<Sujet>Config` et son entrée dans
`ConfigurationService.environment`.

**Vérification avant promotion de branche** (`dev → staging`, `staging → release`, `release → main`) :

```bash
yarn check:environment
```

---

## 24. Monopoles des services, et leurs exceptions

| Ressource                      | Seul module autorisé       |
| ------------------------------ | -------------------------- |
| `fetch`                        | `HttpService`              |
| `localStorage`                 | `StorageService`           |
| `console`                      | `LoggerService`            |
| `process.env`                  | `EnvironmentService`       |
| `src/configurations/`          | `ConfigurationService`     |
| `lucide-react`                 | `declarations/ui/icons.ts` |
| `next/link`, `next/navigation` | `src/i18n/routing.ts`      |

Quelques exceptions, assumées et vérifiées :

- `src/types/theme.ts` et `src/types/validation.ts` importent leur JSON en **`import type` seulement**,
  pour dériver `ColorName`/`RadiusName` et `LimitName`. Aucune valeur n'est lue à l'exécution.
- `ThemeService.buildBootScript()` produit une chaîne contenant `localStorage`, exécutée par le navigateur avant la première peinture. La clé vient tout de même de `StorageService.buildKey`.
- `tailwind.config.ts` importe `theme.json` et `configurations/system/timings.json` directement : ce
  fichier tourne dans Node au moment du build, hors de l'arbre `src/`, jamais dans le navigateur ni
  le serveur applicatif.
- `src/declarations/forms.ts` lit `ConfigurationService.validation.limits` pour construire `FORMS` au
  chargement du module. `ConfigurationService` n'a ni état ni effet de bord : c'est un simple relais
  synchrone vers `configurations/`, la seule façade que `declarations/` est autorisé à traverser pour
  atteindre une configuration minimale du dossier `configurations/system/`.

Ces cas mis à part, les commandes de vérification du skill `code-style` doivent rendre un résultat vide.

---

## 25. Vocabulaire canonique

|                  |                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Déclaration**  | `src/declarations/naming.ts` (`ACTIONS`, `ENTITIES`, `BOOLEAN_PREFIXES`, `HANDLER_PREFIXES`, `TRANSLATION_NAMESPACES`) |
| **Service**      | `src/services/NamingService.ts`                                                                                        |
| **Dictionnaire** | `structure/CONVENTIONS.md`                                                                                             |

**Variables** — `NamingService.toSlug()`, `toEventName()`, `toTranslationKey(namespace, ...segments)`,
`toActionKey(action)`, `toDomId(...segments)`, `toCssVariable(group, name)`.
**Types** — `ActionName`, `EntityName`.
**Règle** — une intention métier n'a qu'un identifiant canonique, déclaré une fois dans `ACTIONS` ou
`ENTITIES`. Chacune de ses formes dérivées (slug, clé i18n, nom d'événement, id DOM, variable CSS)
passe par `NamingService`, jamais réécrite à la main.

**Ajouter une action ou une entité** : une entrée dans `ACTIONS` ou `ENTITIES`, et sa ligne dans
`structure/CONVENTIONS.md`. Aucun autre fichier ne change.

---

## 26. Classes de base et enums bidirectionnels

|                 |                                                                                                                               |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Déclaration** | `src/structures/constants.ts` (`FormStatuses`, `HttpStatuses`)                                                                |
| **Classes**     | `src/structures/Service.ts`, `Page.ts`, `Route.ts`, `Overlay.ts`                                                              |
| **Étendu par**  | Les 15 `src/services/*Service.ts` métier, les pages avec `routeId`, `src/app/api/forms/[formId]/route.ts`, `OverlayShell.tsx` |

**Enums** — `structures/constants.ts` regroupe tout enum interne (statut, rôle, type, origine) qui ne
porte **aucun contrat externe** : pas une valeur HTTP wire, pas un attribut DOM, pas un type
`<input>`, pas une clé de traduction, pas un nom de branche git. Chaque objet est bidirectionnel
(`Idle: 0` **et** `0: 'Idle'`), en `as const`, nommé au pluriel en PascalCase. Les valeurs numériques
sont stables : on ajoute en fin de liste, on ne réordonne jamais. Un seul bloc `export { ... }` en fin
de fichier, aucune logique.
**Ce qui reste dans `declarations/`** — un registre dont la valeur **est** le contrat externe qu'il
représente (`HTTP_METHODS`, `FIELD_TYPES`, `TRANSLATION_NAMESPACES`, `ENVIRONMENT_REGISTRY`,
`VALIDATION_RULES`, `ROUTES`, les modes de thème). Le renuméroter casserait ce que le registre décrit
(fetch, HTML, i18n, CI, Tailwind). C'est la même distinction que les monopoles du §24 : la valeur n'est
pas un choix interne, elle appartient à un système externe.

**Classes** — `Service` expose `this.config` (`ConfigurationService`) et `this.logger` (journal
préfixé par `scope`) en cascade, et `guard()`/`onError()` pour l'erreur commune. `Page` centralise
`metadata()` (délègue à `SeoService.buildMetadata`) et déclare `render()` à implémenter, avec
avertissement par défaut si un sous-type ne le fait pas. `PageRenderContext` porte aussi `breadcrumb`
et `action`, deux créneaux `ReactNode` optionnels que la route calcule (fil d'Ariane, bouton de retour)
et que `render()` insère où il veut — voir §29. `Route` centralise `respond()`/`fail()` et la
dérivation de la clé d'erreur depuis `HttpStatuses`. `Overlay` factorise le portail/voile/échap/gel de
scroll partagé par `Modal`, `Drawer`, `Accordion`, `Tooltip` via `OverlayShell`.
**Exclus de `Service`** — `ConfigurationService`, `EnvironmentService`, `LoggerService` : ce sont les
dépendances que `Service` expose, les étendre créerait un cycle de bootstrap. Exception assumée, au
même titre que celles du §24.

**Ajouter un enum** : une entrée dans `structures/constants.ts`, en fin d'objet. **Ajouter un
service** : étendre `Service`, l'instancier une fois avec un `scope`, exporter l'instance sous le même
nom qu'aujourd'hui.

---

## 27. CTA collant mobile

|                  |                                                             |
| ---------------- | ----------------------------------------------------------- |
| **Composant**    | `src/components/structures/navigation/StickyActionBar.tsx`  |
| **Variantes**    | `STICKY_ACTION_BAR_STYLES`, `SCROLL_TO_TOP_STYLES` (décalé) |
| **Consommé par** | `src/components/layout/SiteLayout.tsx`                      |
| **Drapeau**      | `features.json → stickyActionBar`                           |

**Comportement** — barre pleine largeur fixée en bas de viewport, visible uniquement sous `md`
(`md:hidden`), reprenant `NavigationService.callToActionRoute()`. Complète le CTA d'en-tête, déjà
`sticky` (`NAVIGATION_STYLES.header`) et donc visible sans défiler sur desktop : les deux ensemble
couvrent « CTA sans scroll » sur toutes les tailles d'écran.
**Espace de sécurité** — `pb-[max(0.75rem,env(safe-area-inset-bottom))]` évite la zone d'encoche iOS.
**Non-chevauchement** — `ScrollToTop` remonte à `bottom-20` sous `md` et redescend à `bottom-6` au-delà,
pour ne jamais se superposer à la barre. Cette valeur doit rester cohérente avec la hauteur de la barre
si l'une des deux change.
**Contenu de page** — `SiteLayout` ajoute `pb-20 md:pb-0` au `<main>` quand le drapeau est actif, pour
que le dernier bloc de page ne passe pas sous la barre.

**Ajouter/retirer** : le seul geste est le drapeau `stickyActionBar`. Aucun autre fichier ne change.

---

## 28. Localisation et itinéraire

|                  |                                                                             |
| ---------------- | --------------------------------------------------------------------------- |
| **Composant**    | `src/components/structures/layout/LocationMap.tsx`                          |
| **Service**      | `src/services/NavigationService.ts` (`mapEmbedUrlOf`, `mapDirectionsUrlOf`) |
| **Type**         | `PostalAddress` dans `src/types/navigation.ts`                              |
| **Donnée**       | `identity.json → address`                                                   |
| **Consommé par** | `src/components/sections/ContactSection.tsx`                                |
| **Drapeau**      | `features.json → locationMap`                                               |

**Variables** — `mapEmbedUrlOf(address)` construit l'URL d'intégration sans clé
(`google.com/maps?q=...&output=embed`) ; `mapDirectionsUrlOf(address)` construit le lien officiel
d'itinéraire (`google.com/maps/dir/?api=1&destination=...`), sans clé d'API ni facturation. Un clone
frais du template affiche donc la carte sans configuration supplémentaire, contrairement à l'API
d'intégration Google payante.
**Clés i18n** — `sections.contact.map.title` (titre accessible de l'iframe), `actions.getDirections`.

**Ajouter/retirer** : le drapeau `locationMap`. Changer d'adresse : `identity.json → address`, déjà lu
partout ailleurs (pied de page, schéma `Organization`, mentions légales).

---

## 29. Fil d'Ariane sur les pages

|                  |                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| **Composant**    | `src/components/structures/navigation/Breadcrumb.tsx`                                                 |
| **Service**      | `NavigationService.breadcrumbOf(routeId, translate)`                                                  |
| **Consommé par** | `contact`, `showcase`, `legal-notice`, `privacy-policy`, `thank-you` (`src/app/[locale]/**/page.tsx`) |

**Câblage** — chaque route récupère une instance non scopée de `getTranslations()`, construit
`NavigationService.breadcrumbOf(routeId, translate)` et la passe en `breadcrumb` au contexte de
`page.render()` (voir §26). `PageHeader` reçoit ce nœud dans sa prop `breadcrumb`, déjà prévue.
**Clé i18n** — `navigation.breadcrumb` (libellé accessible de la balise `<nav>`).
**Règle** — la page d'accueil n'affiche pas de fil d'Ariane : `breadcrumbOf('home', ...)` ne rend
qu'une seule entrée, non affichée par construction des pages existantes.

**Ajouter à une nouvelle page** : reprendre le bloc `breadcrumb: <Breadcrumb entries={...} label={...} />`
d'une des pages listées ci-dessus. Aucun nouveau fichier.

---

## 30. Page de remerciement

|                   |                                                             |
| ----------------- | ----------------------------------------------------------- |
| **Route**         | `thankYou` dans `ROUTES` (`/thank-you`, `indexable: false`) |
| **Page**          | `src/app/[locale]/thank-you/page.tsx`                       |
| **Déclenchement** | `FormDeclaration.redirectRouteId` (voir §5)                 |

**Comportement** — `FormRenderer` redirige vers la route déclarée au lieu d'afficher l'`Alert` de
succès inline, via `useRouter` de `@/i18n/routing`. Le formulaire `contact` déclare
`redirectRouteId: 'thankYou'` ; `newsletter` ne le déclare pas et garde le comportement inline.
**Rendu** — `EmptyState` figure `message`, réutilise `routes.thankYou.label` et `.metaDescription`
comme titre et description (même convention que les pages légales), action `routes.home.label`.
**SEO** — `indexable: false` exclut la page du sitemap et force `robots: noindex` via
`SeoService.buildMetadata`, déjà générique (voir §3, §4).

**Ajouter une redirection à un autre formulaire** : `redirectRouteId: '<routeId>'` dans sa déclaration
`FORMS`. Aucun autre fichier ne change.

---

## 31. Promesse de réponse ou de livraison

|                  |                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------- |
| **Déclaration**  | `PROMISES` dans `src/declarations/content.ts`, type `FeatureItem` (réutilisé, voir §19) |
| **Consommé par** | `src/components/sections/ContactSection.tsx`                                            |

**Rendu** — une rangée de `Badge` (icône + ton + libellé court) au-dessus du formulaire de contact.
Le template livre deux exemples génériques, `response` et `delivery` : un projet garde, retire ou
renomme les entrées selon sa promesse réelle.
**Clés i18n** — `sections.contact.promises.<id>.label`.

**Ajouter une promesse** : une entrée dans `PROMISES` et son libellé dans `messages/`. Aucun nouveau
composant, aucun nouveau type.

---

## 32. Page 404 personnalisée

|                  |                                                               |
| ---------------- | ------------------------------------------------------------- |
| **Page**         | `src/app/[locale]/not-found.tsx`                              |
| **Filet racine** | `src/app/not-found.tsx`, `src/app/layout.tsx`                 |
| **Clés i18n**    | `errors.notFound`, `errors.notFoundHint`, `routes.home.label` |

**Piège Next.js + next-intl** — un `not-found.tsx` posé uniquement sous `app/[locale]/` ne se déclenche
que pour un `notFound()` explicite atteint depuis une page déjà résolue. Une URL qui ne correspond à
**aucune** route (`/n-importe-quoi`, une faute de frappe, un lien mort) ne passe jamais par
`[locale]/layout.tsx` : App Router retombe sur son 404 générique, sans thème ni traduction.
**Filet** — `src/app/not-found.tsx` réutilise `[locale]/layout.tsx` et `[locale]/not-found.tsx` avec le
`defaultLocale`, pattern documenté par next-intl. Ce filet racine exige un `app/layout.tsx` : le nôtre
ne rend que `children`, sans balise `<html>`/`<body>`, pour ne pas dupliquer celles déjà posées par
`[locale]/layout.tsx` sur toutes les routes normales.
**Vérification** — un aller simple en navigateur ne suffit pas ; `curl` une route qui n'existe pas et
lire `<title>` : le titre générique Next (« This page could not be found ») signale que le filet racine
manque.

---

## 33. Consentement aux cookies

|                  |                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| **Type**         | `src/types/consent.ts` (`ConsentStatus`, `ConsentCategoryDeclaration`, `ConsentPreferences`, `ConsentState`) |
| **Déclaration**  | `src/declarations/analytics.ts` (`CONSENT_CATEGORIES`, type `ConsentCategory`)                               |
| **Service**      | `src/services/ConsentService.ts`                                                                             |
| **Composants**   | `src/components/structures/feedback/ConsentManager.tsx`, `src/components/layout/AnalyticsGate.tsx`           |
| **Consommé par** | `src/app/[locale]/layout.tsx`                                                                                |
| **Drapeau**      | `features.json → analytics` (aucun drapeau dédié, voir plus bas)                                             |

**Consentement par catégorie** — `CONSENT_CATEGORIES` déclare chaque catégorie de cookie
(`necessary`, `analytics` à ce jour) avec `isRequired` (toujours acceptée, jamais désactivable) et un
`feature` optionnel (nom de drapeau `features.json` qui la fait apparaître). L'état persisté est
structuré `{ status, preferences }` (`ConsentState`), `preferences` étant un booléen par catégorie,
et non plus un simple `'granted' | 'denied'`.
**Variables** — `ConsentService.use()` (état réactif), `categories()` (catégories dont le drapeau est
actif), `hasChoices()` (au moins une catégorie non obligatoire disponible), `isRequired(category)`,
`allows(category)`, `save(preferences)`, `grant()`, `deny()`, `reset()`. État persisté via
`StorageService` sous `STORAGE_KEYS.consent`.
**Bulle et modale** — `ConsentManager` remplace l'ancien bandeau accepter/refuser : une bulle flottante
persistante (bas-gauche, icône `public/cookies/cookie.png`, dégagée de `ScrollToTop` et de la barre
d'action collante qui occupent le bas-droite) ouvre une modale de préférences avec un switch par
catégorie (`FIELD_STYLES.switchTrack`/`switchThumb`, réutilisés tels quels). `ConsentManager` se rend
`null` quand `hasChoices()` est faux : un clone frais du template (`analytics: false`) n'affiche donc
aucune bulle. Monté sans condition dans `[locale]/layout.tsx`, la disponibilité se pilote entièrement
par catégorie plutôt que par un drapeau câblé en dur dans le layout.
**Câblage analytique** — `AnalyticsGate` (client) ne monte `<Analytics />` (Vercel) et
`<GoogleAnalytics>` (GA4) que lorsque `ConsentService.use().preferences.analytics` est vrai.
**Clés i18n** — `consent.title|description|privacyLink|required`,
`consent.actions.declineAll|saveChoices|acceptAll`,
`consent.categories.<category>.label|description`, `actions.manageCookies`.
**Cohérence avec le texte légal** — `legal.privacyPolicy.sections.cookies` décrit exactement ce
comportement (pas de cookie hors consentement) ; modifier l'un sans l'autre romprait cette cohérence.

**Ajouter une catégorie** (point d'extension, par exemple `marketing`) :

1. une entrée dans `CONSENT_CATEGORIES` (`declarations/analytics.ts`), avec son `feature` si elle doit
   être gagée par un drapeau ;
2. son glyphe dans `CATEGORY_ICONS` (`ConsentManager.tsx`) — la vérification de type échoue tant que ce
   n'est pas fait ;
3. le bloc `consent.categories.<category>.label|description` dans **chaque** fichier de `messages/`.

Aucun autre fichier ne change : la modale, la persistance et le calcul du statut lisent
`CONSENT_CATEGORIES` seuls.

---

## 34. En-têtes de sécurité et intégration continue

|                   |                                                                               |
| ----------------- | ----------------------------------------------------------------------------- |
| **Configuration** | `next.config.ts` (`headers()`, `CONTENT_SECURITY_POLICY`, `SECURITY_HEADERS`) |
| **CI**            | `.github/workflows/ci.yml`                                                    |

**En-têtes posés sur toutes les routes** — `Content-Security-Policy`, `X-Content-Type-Options`,
`X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`.
**CSP** — `script-src` autorise `'unsafe-inline'` : Next.js injecte ses propres scripts de reprise
(hydratation de l'App Router) en ligne, sans nonce par défaut. Passer à un CSP par nonce demanderait de
faire transiter un nonce généré dans `src/middleware.ts` jusqu'au rendu serveur (`next/headers`), ce
que `next-intl`'s `createMiddleware` ne documente pas officiellement ; non fait ici pour ne pas
fragiliser le routage i18n. `script-src` reste malgré tout limité aux origines déclarées (`self`,
Google Analytics, Vercel) ; `frame-ancestors 'none'`, `object-src 'none'` et `base-uri 'self'` couvrent
le clickjacking et l'injection de balises de base. `frame-src` autorise `google.com` pour l'iframe de
`LocationMap` (§28).
**Ajouter une origine tierce** : l'ajouter à la directive concernée dans `CONTENT_SECURITY_POLICY`
(`next.config.ts`). Aucun autre fichier ne change.
**CI** — un seul workflow, deux jobs : `validate` (installation, `type-check`, `lint`,
`format:check`, `build`, `check:registre`, `check:environment`) sur push/PR vers les quatre branches,
et `dependency-review` sur PR uniquement. L'environnement (`APP_ENV`) se déduit du nom de la branche
ciblée par la même correspondance que `ENVIRONMENT_REGISTRY` (§23).
**Ajouter une vérification** : une étape dans le job `validate` de `.github/workflows/ci.yml`.

---

## 35. Révélation au scroll

|            |                                                                         |
| ---------- | ----------------------------------------------------------------------- |
| **Styles** | `src/styles/globals.css` (classes `reveal-*`, `@keyframes`, `.marquee`) |
| **Jetons** | `MOTION` dans `src/declarations/ui/tokens.ts`                           |

**Classes** — `reveal`, `reveal-soft`, `reveal-left`, `reveal-right`, `reveal-zoom`, `reveal-wipe`,
`reveal-stagger`, `reveal-picture`, chacune exposée par `MOTION` (`MOTION.reveal`, `MOTION.revealSoft`,
...) pour ne jamais écrire la classe CSS en dur dans un composant. `MOTION.marquee`/`marqueeViewport`
exposent de la même façon `.marquee-track`/`.marquee` (bandeau défilant en boucle, voir plus bas).
**Mécanisme** — CSS pur, piloté par `animation-timeline: view()` (`@supports` en garde) : chaque
classe joue une animation `@keyframes` dédiée dont la progression suit le défilement de l'élément dans
le viewport, sans `IntersectionObserver` ni JavaScript. `reveal-stagger` anime les enfants directs les
uns après les autres via des `animation-range` décalés par `:nth-child`.
**Repli** — un navigateur sans support de `animation-timeline: view()` ignore le bloc `@supports` :
tout reste visible, sans état intermédiaire. `prefers-reduced-motion: reduce` coupe déjà toute
animation par la règle générale de fin de fichier.
**Bandeau défilant** — `.marquee`/`.marquee-track` (logos clients, avis en boucle) : masque en
dégradé sur les bords, mis en pause au survol/focus, retombe sur `overflow-x: auto` sous
`prefers-reduced-motion: reduce`. Anime via `animate-marquee` (Tailwind, voir §15/`tailwind.config.ts`,
durée `timings.json → marqueeDurationMs`).

**Ajouter une classe de révélation** : un `@keyframes`, l'entrée `@supports`/`prefers-reduced-motion`
dans `globals.css`, puis son entrée dans `MOTION`. Aucun autre fichier ne change.

---

## 36. Fond de page texturé procédural

|               |                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------- |
| **Composant** | `src/components/layout/TexturePageBackdrop.tsx`                                               |
| **Styles**    | `TEXTURE_BACKDROP_STYLES` (§15), classes `.texture-frame`/`.texture-grain` dans `globals.css` |

**Technique** — deux calques fixes en `z-index` négatif, sous le contenu de page : `.texture-frame`
porte l'image de fond (SVG passé en prop `src`, appliqué en `style` inline pour rester générique — le
composant ne présume d'aucun visuel), `.texture-grain` superpose une texture de grain légère en
`data:` URI (`feTurbulence`), sans aucune image bitmap. `main > section { position: relative }` donne
à chaque section sa propre pile d'empilement pour qu'elle passe au-dessus des deux calques fixes.
**Non branché par défaut** — le template ne fournit aucun visuel de fond : `TexturePageBackdrop` est un
patron disponible, pas un élément monté dans `SiteLayout`. Un projet dérivé qui veut un fond texturé
pose son propre SVG dans `public/images/`, l'importe dans `SiteLayout.tsx` avec
`<TexturePageBackdrop src="/images/<fichier>.svg" />`, et ajoute `bg-transparent`/`surface-glass` (§15)
aux surfaces qui doivent laisser transparaître le fond plutôt que le couvrir.

**Utiliser le patron** : une entrée dans `SiteLayout.tsx`, un fichier SVG dans `public/images/`. Aucun
autre fichier ne change.

---

## 37. Prise de rendez-vous

|                   |                                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Services**      | `src/services/AppointmentService.ts`, `src/services/CalendarService.ts`                                                                   |
| **Configuration** | `src/configurations/booking.json` (`slotMinutes`, `durationMinutes`, `minimumNoticeHours`, `horizonDays`), `identity.json → openingHours` |
| **Types**         | `src/types/booking.ts`                                                                                                                    |
| **Déclaration**   | `bookAppointment` dans `FORMS` (§5), `SECTION_ANCHORS.booking`                                                                            |
| **Composant**     | `src/components/sections/BookingSection.tsx`, styles `BOOKING_STYLES` (§15)                                                               |
| **Route API**     | `src/app/api/appointments/route.ts` (`GET` disponibilités, `POST` réservation)                                                            |
| **Drapeau**       | `features.json → appointmentBooking` (`false` par défaut)                                                                                 |

**Moteur de créneaux** — `AppointmentService` calcule les créneaux disponibles à partir des horaires
d'ouverture (`identity.json → openingHours`, un jour de semaine + heure d'ouverture/fermeture), du
fuseau horaire du projet (`localization.json → timeZone`), d'un délai de prévenance minimum
(`minimumNoticeHours`) et d'un horizon de réservation (`horizonDays`). Variables — `today()`,
`instantOf(date, time)`, `hoursOf(date)`, `openingSchedule()` (horaires groupés par jours consécutifs
identiques, pour l'affichage), `isBookable(date)`, `slotsOf(date)`, `freeSlotsOf(date, busy)`,
`monthGridOf(year, month)`, `availabilityOf(date)`, `book(request)`. Rien dans ce service n'est
spécifique à un métier : il sert toute activité qui vend des créneaux (praticien, coach, artisan,
photographe...), pas seulement la prise de rendez-vous d'un salon.
**Synchronisation Google Calendar** — `CalendarService` (serveur uniquement, `import 'server-only'`)
s'authentifie par compte de service : JWT signé avec `node:crypto` (`createSign('RSA-SHA256')`),
échangé contre un jeton d'accès via `HttpService`'s option `form` (§8, endpoint OAuth `grant_type:
jwt-bearer`). `busyRangesOf(from, to)` lit les plages occupées (`freeBusy`), `createEvent(event)` écrit
l'événement à la réservation. `isConfigured()` renvoie faux tant que `calendarId`/`clientEmail`/
`privateKey` ne sont pas tous les trois renseignés : le service reste alors en marche à vide
(`busyRangesOf` rend `[]`, `createEvent` journalise et rend `false`), comme `MailService` (§22).
**Sujet d'environnement** — `calendar` (§23), quatre variables : `GOOGLE_CALENDAR_ID`,
`GOOGLE_CALENDAR_CLIENT_EMAIL`, `GOOGLE_CALENDAR_PRIVATE_KEY` (les retours à la ligne échappés `\n`
survivent au passage par une variable d'environnement, `readCalendarConfig` les restitue).
**Module optionnel** — `appointmentBooking` est à `false` par défaut : un clone frais du template
n'affiche donc pas `BookingSection` (composition conditionnelle dans `[locale]/page.tsx`, voir §19).
Le composant garde malgré tout son propre repli interne (`ConfigurationService.isEnabled(...)` rend
une alerte « réservation fermée » plutôt que le calendrier) pour le cas où un projet dérivé le monte
ailleurs sans reprendre ce garde-fou.
**Formulaire** — `bookAppointment` (`declarations/forms.ts`) est volontairement minimal (`fullName`,
`email`, `phone`, `note`) : un projet dérivé y ajoute ses propres champs (type de prestation, par
exemple) sans toucher au moteur de créneaux ni à la route API.

**Activer pour un projet dérivé** :

1. `features.json → appointmentBooking: true` ;
2. `identity.json → openingHours` avec les vrais horaires ;
3. créer un compte de service Google Cloud, partager le calendrier avec son adresse, poser
   `GOOGLE_CALENDAR_ID`, `GOOGLE_CALENDAR_CLIENT_EMAIL`, `GOOGLE_CALENDAR_PRIVATE_KEY` ;
4. étendre `bookAppointment` dans `declarations/forms.ts` si le projet a besoin d'un champ
   supplémentaire (type de prestation, nombre de personnes...).

Sans l'étape 3, le module reste fonctionnel : les créneaux se calculent sur les horaires d'ouverture
seuls, la réservation part par courriel (`MailService`) sans écrire dans un agenda partagé.
