---
name: ai-tells
description: Les huit signes qui trahissent un site ou une app généré par une IA (dark mode sans contraste, espacement incohérent, fade-in au scroll, bouton qui s'estompe au survol, tirets cadratins, buzzwords, italique serif sur les mots accent, grain sur un dégradé) et quoi faire à la place. À charger AVANT de créer ou retoucher une page, un composant visuel, une palette, une animation ou un texte affiché, et en relecture avant livraison.
---

# Signes d'un design fait par une IA

Un visiteur ne se dit pas « c'est fait par une IA ». Il sent que c'est générique, et il fait moins confiance. Les huit signes ci-dessous sont ceux qu'on repère au premier coup d'œil. Aucun n'est interdit dans l'absolu : chacun est **exclu par défaut**, et ne revient que si le brief le demande en toutes lettres.

Ce skill est la liste de contrôle. `frontend-design`, quand il existe dans le dépôt, porte la démarche créative (plan de palette, typo, signature) ; les deux se complètent, aucun ne remplace l'autre.

## Les huit signes

### 1. Dark mode sans contraste

Gris sur gris, cartes qui se confondent avec le fond, texte secondaire illisible. C'est le mode sombre obtenu en inversant la palette claire sans la retravailler.

- Texte courant : **4,5:1 minimum** sur chaque surface où il apparaît (fond, carte, carte surélevée, champ). Texte ≥ 24 px ou ≥ 18,66 px gras : 3:1.
- Le texte « discret » (`ink-subtle`, `muted`, légendes, placeholders) est le premier à tomber sous le seuil : c'est lui qu'on mesure en premier, sur la surface la plus claire du mode sombre.
- Deux surfaces empilées se distinguent : bordure visible ou écart de luminance franc, pas deux gris à 3 % l'un de l'autre.
- Mesurer, pas estimer : `python3 .claude/skills/ai-tells/scripts/contrast.py "#texte" "#fond1" "#fond2"`, sur chaque token de texte, en clair puis en sombre. Le script sort en erreur sous 4,5:1.

### 2. Espacement incohérent

`mt-3` ici, `mt-5` là, `gap-7` ailleurs, `p-[13px]` pour rattraper un alignement. L'œil ne sait pas dire pourquoi, mais il voit que rien ne tombe juste.

- Une seule échelle d'espacement (celle des tokens du projet), un rythme vertical par type de section, le même écart entre deux blocs de même niveau partout.
- Aucune valeur arbitraire (`-[13px]`, `style={{ marginTop: 18 }}`) pour corriger un alignement : on corrige la structure.

### 3. Fade-in au scroll

Chaque section qui glisse et apparaît en fondu quand on descend. C'est l'animation par défaut de tous les générateurs : elle retarde la lecture et ne raconte rien.

- Le contenu est visible dès le rendu.
- Le mouvement se réserve à un moment signature (une seule orchestration assumée) ou à un retour d'action (ouverture, validation, glissement d'un tiroir).
- `prefers-reduced-motion` est toujours respecté.

### 4. Bouton qui s'estompe au survol

`hover:opacity-80` sur un bouton : au survol, il pâlit et donne l'impression de se désactiver au moment précis où on veut cliquer.

- Le survol **renforce** : teinte plus profonde, fond qui se remplit, bordure qui s'affirme, ombre, léger déplacement.
- Exception légitime : révéler un élément caché (`opacity-0` → `group-hover:opacity-100`), ou redonner de la présence à un élément volontairement atténué. C'est l'inverse d'un estompage.

### 5. Tirets cadratins partout

« Notre méthode — simple, efficace — vous accompagne. » Le tiret cadratin (—) est la signature la plus reconnaissable des textes générés, surtout en français où l'incise se fait par des virgules.

- Dans la prose affichée : virgule, deux-points, parenthèses ou point. Jamais de « — ».
- Admis : un « — » seul comme valeur vide dans une cellule de tableau ou un compteur sans donnée.
- Les commentaires de code et les skills ne sont pas concernés, seul le texte que voit l'utilisateur compte.

### 6. Texte plein de buzzwords

« Révolutionnez votre routine », « une expérience fluide et sans effort », « libérez votre plein potentiel », « solution innovante », « propulsez », « plongez au cœur de », « à la pointe », « de nouveaux sommets », « sur mesure » à chaque ligne, les triplets d'adjectifs (« simple, rapide et efficace »). En anglais : _seamless, unlock, elevate, empower, game-changer, cutting-edge, delve_.

- Dire ce que ça fait, pour qui, avec un chiffre, un nom ou un exemple réel du client.
- Verbes simples, phrases courtes, une idée par phrase.
- Un bouton dit ce qui se passe quand on clique (« Réserver mon appel »), pas une promesse (« Commencer l'aventure »).

### 7. Italique serif sur les mots accent

« Le coaching qui _transforme_ » avec le mot mis en valeur dans une serif italique fine et colorée, au milieu d'un titre en sans-serif. Tic typographique des landing pages générées depuis 2024.

- L'emphase passe par la graisse, la taille ou la couleur, dans la même famille que le reste du titre.
- Une serif n'apparaît que si elle est une police du projet à part entière, utilisée avec constance, pas pour un seul mot par titre.

### 8. Texture de grain sur un dégradé

Un bruit `feTurbulence` posé par-dessus un dégradé pour lui donner un air « organique ». Le duo est devenu un marqueur immédiat.

- Un dégradé tient seul, ou il n'existe pas.
- Si une matière est voulue, elle vient d'une vraie photo ou d'un vrai matériau du sujet du client (marbre, papier, textile), pas d'un bruit générique.
- Un grain très léger sur une **photo** est un autre cas : à justifier, jamais par défaut.

## Vérification rapide

À lancer depuis la racine du dépôt. Chaque ligne qui sort est à examiner, pas forcément à corriger : les exceptions de chaque section restent valables.

```bash
# 3. Fade-in au scroll
grep -rnE "whileInView|IntersectionObserver|useInView|data-aos|animate-on-scroll" src
# 4. Boutons qui s'estompent
grep -rnE "(^|[^-])hover:opacity-[0-9]+" src
# 5. Tirets cadratins dans le texte affiché
grep -rn "—" src messages 2>/dev/null | grep -vE ":[0-9]+:\s*(//|\*|/\*)"
# 6. Buzzwords
grep -rniE "révolution|sans effort|fluide|innovant|propuls|plongez|libérez|à la pointe|nouveaux sommets|seamless|unlock|elevate|empower|game.?changer|cutting.?edge" src messages 2>/dev/null
# 7. Serif italique d'accent
grep -rnE "font-serif|<em[ >]|italic" src --include='*.tsx'
# 8. Grain
grep -rnE "feTurbulence|grain|noise" src --include='*.css' --include='*.tsx' --include='*.ts'
# 2. Valeurs d'espacement arbitraires
grep -rnoE "(m|p|gap|space-[xy])[trblxy]?-\[[0-9.]+(px|rem)\]" src | sort | uniq -c | sort -rn | head
```

Le contraste (signe 1) ne se greppe pas : mesurer chaque paire texte/surface des tokens clair et sombre.

## Dans ce template

État relevé le 2026-09-24. Sur un site vitrine, le texte de `src/configurations/windows/messages/*.json` compte autant que le CSS : relire chaque nouvelle clé avec les signes 5 et 6.

| Signe                   | État                                                                                                                                                                                                                                                                    | Où                                                   |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 1. Contraste            | Mesuré le 2026-09-24 : `foreground-muted`, `foreground-subtle`, `success`, `warning`, `info`, `danger` passaient sous 4,5:1 en clair (jusqu'à 2,3:1), `foreground-subtle` en sombre ; tous remontés au-dessus de 4,5:1 sur `background`, `surface` et `surface-strong`. | `src/configurations/theme.json`                      |
| 2. Espacement           | Échelle Tailwind + `SECTION_SPACING`.                                                                                                                                                                                                                                   | `src/declarations/ui/tokens.ts`                      |
| 3. Fade-in au scroll    | Les classes `MOTION.reveal*` existent (animations liées au défilement, CSS pur) mais aucune section ne les utilise. Les réserver à un moment signature par page, jamais sur chaque section.                                                                             | `src/declarations/ui/tokens.ts`, `globals.css`       |
| 4. Bouton qui s'estompe | Corrigé : le bouton `danger` fonçait à 90 % d'opacité, il fonce maintenant (`brightness-90`).                                                                                                                                                                           | `BUTTON_VARIANTS`                                    |
| 5. Tirets cadratins     | Retiré du gabarit de titre SEO (`%s                                                                                                                                                                                                                                     | …`). Reste le `—` de valeur vide des nombres, admis. | `configurations/seo.json` |
| 6. Buzzwords            | Aucun. « Sur mesure » reste comme nom d'une offre réelle.                                                                                                                                                                                                               | `src/configurations/windows/messages/*.json`         |
| 7. Serif italique       | Aucune.                                                                                                                                                                                                                                                                 |                                                      |
| 8. Grain                | Retiré : un bruit `feTurbulence` était posé sur la texture procédurale de `TexturePageBackdrop`.                                                                                                                                                                        |                                                      |
