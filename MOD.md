# GAME MODE · Co-op Quest

**Unverified beta, v0.1.0.** Standalone Claude Code mod for an honest local Pair Extraordinaire journey. Real SDK validation and live GraphQL integration are pending. No badge status or existing silver baseline is inferred.

## Install (beta)

Requires Claude Code 2.1.287+ (the upstream SDK baseline) and an already authenticated local GitHub CLI. This mod never installs gh, logs in, reads tokens or sets authentication environment variables.

~~~text
/plugin marketplace add Reasonofmoon/coop-quest
/plugin install game-coop-quest@coop-quest
~~~

From a local clone of this repository: `claude --plugin-dir .`

## Keyboard commands

- /coop-quest: open the persistent local RPG pane. No process or network call.
- /coop-quest scan OWNER/REPO: explicitly read the selected repository through existing gh authentication. Private repositories are permitted only because you explicitly requested this scan.
- /coop-quest scan: explicitly discover the current repository with gh repo view --json nameWithOwner. A blank player setting uses gh api user --jq .login; set player to Reasonofmoon to track that linked login rather than the authenticated account.
- /coop-quest export: return local schema-version-1 JSON, preceded by a private-data warning. Review PR URLs and titles before sharing. No upload, file save or model-origin export is performed by this mod. Claude Code may retain typed command output in its local transcript; do not export sensitive records into a session you will share.
- /coop-quest clear: replace only this plugin's project store with an empty record. No files are deleted, and GitHub is never changed.

Only composer/bridge origins may scan, export or clear. Agent/model-origin attempts are rejected before any process or store mutation. Plain viewing remains available. intensity=off does not draw, restore, scan or record; explicit user clear still removes the plugin record. There are no tool hooks, timers, automatic scans, polling, commits, pushes, merges, stars or coauthor changes.

## What the game measures

100 local XP per unique eligible PR in the **latest observed repository sample**, level 1 plus one level per 300 XP. Community-reported checkpoints are 1, 10, 24 and 48, not official GitHub counters. A PR is eligible only when a single commit has the player and at least one different linked GitHub user in commit.authors.nodes. PR authorLogin is metadata only, never coauthor evidence. Authors from separate commits do not qualify. Unlinked names/emails are ignored and never persisted. Each PR counts once, even with multiple qualifying commits. Linked logins and PR titles/URLs are saved locally; no names, emails or tokens are saved.

The pane intentionally says badge status unknown and no assumed 24-PR baseline. A new scan replaces the displayed dataset rather than inventing account totals or unioning incompatible coverage. XP can therefore decrease when the chosen repo/player changes or the 100-PR window moves. Local seen-PR history prevents repeated newly-observed toasts; milestone toasts are one-time per player/repo until clear. First scan can toast historical PRs as **newly observed**, never as newly merged.

## Coverage and public interchange

The fixed read-only GraphQL query requests the last 100 merged PRs ordered by UPDATED_AT ascending, the first 100 commits of each, and the first 20 linked-author entries per commit. This is a recently-updated merged-PR sample, **not strict merge-date order**. hasNextPage on any connection, and hasPreviousPage on the last-100 PR connection, set truncated=true. No additional pages are fetched. complete is always false because only one repo/sample was scanned, even if all page flags are false.

~~~json
{"schemaVersion":1,"player":"Reasonofmoon","source":"graphql","scannedAt":"2026-10-29T00:00:00.000Z","coverage":{"complete":false,"scope":"repo OWNER/REPO last100 mergedPR","truncated":false},"pullRequests":[]}
~~~

An eligible row has url, title, mergedAt, authorLogin (nullable PR-author login), coauthors (including player and a distinct other linked login), evidence:"linked-authors", commitSha. Export revalidates and whitelists fields. The empty example is a schema illustration, not a reported scan.

## SDK conventions and validation limits

Root register.tsx imports the plugin-local TypeScript core.ts, not an unverified .mjs loader path. core.ts is the byte-for-byte .mjs source after its two-line TypeScript header; a Node test enforces equivalence. Its @ts-nocheck header is deliberate because shared pure JavaScript is mirrored without a compilation dependency. coop-core.d.mts documents the Node consumer interface; real installed SDK type checking remains required. palette.ts is an exact copy of upstream game-quest/hooks/palette.ts. Root types augment PluginState. hooks/hooks.json points ../register.tsx relative to hooks, following upstream ./register.tsx resolution. Marketplace source is ./ and both versions/names match.

All event names are literal on(...) registrations, all engine calls use full $.foo forms, and helper functions receiving $ are top-level declarations. process.run uses array arguments and timeoutMs:20000 following game-map/game-earcons. Failed processes, malformed JSON and GraphQL errors are summarized without stderr/stdout or raw exception dumps. No connection failure is converted into a zero count. There is a per-registration busy guard, but not a cross-session lock; avoid concurrent scans of the same project from multiple sessions.

Pure tests: `node --test coop-core.test.mjs` (Node 18+; zero dependencies, no network). The parent ran all 12 tests successfully in isolated Aside-Sandbox on 2026-10-29. SDK fixture tests: claude plugin test .; strict validation: claude plugin validate --strict .. Command syntax should be confirmed against the installed CLI. No tests or code were executed by the file-writing child agent; parent must report actual sandbox results. The Claude CLI was reported absent in the available sandbox, so engine rendering, generated-type compatibility and live gh GraphQL behavior remain unverified. Mock tests are not live-authentication evidence.
