export type PullRequestEvidence = { url: string; title: string; mergedAt: string; authorLogin: string | null; coauthors: string[]; evidence: 'linked-authors'; commitSha: string };
export type CoopDataset = { schemaVersion: 1; player: string; source: 'graphql'; scannedAt: string; coverage: { complete: false; scope: string; truncated: boolean }; pullRequests: PullRequestEvidence[] };
export type CoopBook = { dataset: CoopDataset | null; seen: string[]; toasted: string[] };
declare module 'claude-code' { interface PluginState { 'game-coop-quest': { book: CoopBook } } }
