# Verification and limits

## 2026-10-29 pre-publication checks

- Isolated `Aside-Sandbox`, Node v18.19.1: `node --test coop-core.test.mjs`, **12/12 passed**. The first run caught a syntax error in a test fixture; it was fixed before the passing run.
- `node --check app.js` passed in the isolated sandbox.
- Real Chromium UI on an isolated local HTTP preview: synthetic demo, EN/KO toggle, checkbox persistence after reload without XP changes, JSON import/export, unsafe-domain rejection, nullable PR author and 346-character title import, and `coverage.truncated` round trip checked. HTML-looking imported title remained plain text.
- Simulated HTTP 403 and cancellation were exercised in the local browser with an in-memory fetch stub. Existing evidence was preserved; the page was reloaded to remove the stub before real API testing.
- Real unauthenticated public GitHub API scan for Reasonofmoon: 20 merged PRs inspected, 3 trailer candidates found, 0 failed lookups. This is a limited sample, not official GitHub badge credit or an account-wide count. No private evidence is bundled in this repository.
- Mobile viewport 390 x 844: main content width and scroll width both 347 px, no horizontal overflow observed. Desktop preview also checked.
- `preview.png` contains explicitly labelled synthetic demo data, not real achievement claims.

## Publication and SDK checks

- Public HTTPS demo confirmed at https://devlog.moonlang.com/coop-quest/ on 2026-10-29; initial empty state loaded, no automatic scan.
- [Initial CI run](https://github.com/Reasonofmoon/coop-quest/actions/runs/40815688833): success. Strict marketplace/plugin/hooks validation passed on Claude Code **2.1.312**; SDK fixture tests **2/2 passed**, including terminal and desktop rendering. Core CI job also passed.
- Runtime beta remains appropriate because live authenticated gh integration was not exercised.

## Not yet verified

- Authenticated `gh` GraphQL scanning was not available locally: the sandbox has no account credentials. The mod is not a confirmed end-to-end live-account integration. The successful SDK tests above use mocks; check current GitHub Actions for later CI runs.
- No performance or cross-browser certification. Browser local storage is not encrypted.
- GitHub badge awards, answer acceptance, and stars remain decisions/state on GitHub. This project never awards official badges.
