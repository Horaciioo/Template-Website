---
name: nextjs-dev-cleanup
description: Arrête proprement un serveur Next.js de dev oublié ou emballé (RAM énorme, Mac qui chauffe) et supprime le cache .next de ce projet quand il pèse plusieurs Go. À lancer avec /nextjs-dev-cleanup.
disable-model-invocation: true
---

# Nettoyage sûr du serveur de dev Next.js et du cache .next

## Pourquoi ce skill existe

Depuis Next.js 16.1, `next dev` avec Turbopack sauvegarde son travail de compilation dans `.next/dev/cache/turbopack` (option `experimental.turbopackFileSystemCacheForDev`, activée par défaut). Ce cache n'est pas nettoyé automatiquement : sur un serveur laissé ouvert longtemps, il peut atteindre des dizaines de Go, et le processus `next-server` peut monter à plusieurs Go de RAM. Un ticket vercel/next.js #94915 décrit ce comportement en 16.2.6 à 16.2.9. Re-vérifie la doc et les notes de version avant de conclure, car cela évolue.

`.next` est un dossier **généré** par Next.js : le supprimer ne fait perdre aucun code, il est recréé au prochain `next dev`. Le premier démarrage sera simplement plus lent.

## Posture

- L'utilisateur est débutant en dev. Avant chaque étape, explique en une ou deux phrases pourquoi tu la fais, sans jargon inutile.
- Diagnostic en lecture seule d'abord, action ensuite.
- Réponds en français, sans tirets cadratins.

## Règles strictes

- Tu ne supprimes QUE le dossier `.next` du projet courant. Jamais `src`, `.env*`, `prisma`, les migrations, `node_modules`, ni le `.next` d'un autre projet.
- Pas de `sudo`, pas de `kill -9` sans en parler à l'utilisateur, pas de `git clean`, `git reset`, `git checkout`, `git stash`.
- Pas de `rm -rf` avec une variable, un glob ou un chemin relatif : uniquement le chemin absolu littéral, après vérification.
- Ne touche qu'aux processus dont le dossier de travail est ce projet.
- Avant toute action qui arrête un processus, supprime ou modifie un fichier, montre la commande exacte et son effet, puis attends l'accord de l'utilisateur. Un seul accord pour le plan complet suffit.
- "Ignoré par git" ne veut pas dire "régénérable" : `.env` est ignoré mais irremplaçable.

## Procédure

### 1. Vérifications en lecture seule

Depuis le dossier de l'app Next.js (celui qui contient `next.config.*`) :

```bash
pwd
ls next.config.* package.json
git check-ignore -v .next
git status --short
du -sh .next
df -h /System/Volumes/Data
```

- `git check-ignore -v .next` doit répondre avec une ligne de `.gitignore`. Sinon, ARRÊTE-TOI et explique pourquoi.
- Si `.next` fait moins d'environ 1 Go, ce n'est probablement pas la cause du problème : cherche ailleurs (`du -h -d 3 . 2>/dev/null | sort -hr | head -15`).

### 2. Identifier les processus du projet

```bash
ps -Ao pid,ppid,tty,etime,rss,command | grep -E "[n]ext dev|[n]ext-server|[y]arn dev|[n]pm run dev|[p]npm dev" | cut -c1-220
```

Pour chaque PID, confirme le dossier de travail :

```bash
lsof -a -p <PID> -d cwd
```

Garde uniquement ceux dont le dossier est ce projet. Un TTY `??` avec un PPID de 1 signifie un serveur détaché (terminal fermé ou lancé en arrière-plan) : c'est le cas typique d'un serveur qui tourne depuis des heures sans que personne le voie.

### 3. Présenter le plan et attendre l'accord

Liste les PID à arrêter, le chemin absolu de `.next` à supprimer et sa taille. Attends le feu vert.

### 4. Arrêt propre

Un `kill <PID>` simple (signal SIGTERM), dans l'ordre : `next dev`, puis `next-server`, puis `yarn dev` (ou `npm`/`pnpm`). Attends environ 10 secondes après chaque, puis vérifie avec `ps -p <PID>`.

- Si un processus survit à une minute, ne force pas : décris ce que tu vois à l'utilisateur.
- Surveille une minute qu'aucun processus ne réapparaisse. Si oui, identifie son parent avec `ps -p <PPID> -o pid,ppid,tty,etime,command` : un outil ou un agent le relance peut-être.

### 5. Suppression de .next

Vérifie que c'est un vrai dossier, pas un lien symbolique, et que le parent est bien une app Next.js :

```bash
test -d .next && ! test -L .next && echo OK
ls next.config.*
```

Puis supprime avec le chemin absolu littéral affiché à l'étape 3, qui doit se terminer par `/.next` :

```bash
rm -rf -- "/chemin/absolu/vers/le-projet/.next"
```

### 6. Contrôles après suppression

- `df -h /System/Volumes/Data` et `du -sh` avant/après.
- `git status --short` doit être identique à celui de l'étape 1.
- `src`, `.env*` et `package.json` sont toujours là.

### 7. Prévention (sans rien modifier avant accord)

Lis `next.config.*` et le script `dev` de `package.json`, puis propose un diff minimal parmi :

- `experimental: { turbopackFileSystemCacheForDev: false }` dans `next.config`. Compromis : les démarrages à froid sont plus lents.
- `next dev --webpack` (à vérifier que le script accepte l'argument).
- Une mise à jour de Next.js si une version plus récente corrige le problème (à vérifier dans les notes de version).

### 8. Ne pas recréer le problème

Ne relance jamais `yarn dev` en arrière-plan ou détaché (`&`, `nohup`, agent). Demande à l'utilisateur de le lancer dans un terminal visible et de l'arrêter avec `Ctrl+C` en fin de journée. Si un test de démarrage est nécessaire, fais-le au premier plan puis arrête-le.

## Restitution

Termine par un bilan court : processus arrêtés, Go libérés (df avant/après), et suite recommandée. Cite les sources consultées si tu as utilisé le web.
