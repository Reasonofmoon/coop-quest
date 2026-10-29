import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { MILESTONES, QUERY, parseRepo, validLogin, commandPlan, parseGraphQL, datasetOf, progress, exportJSON } from './coop-core.mjs';
const date = '2026-10-29T00:00:00.000Z';
const sha = 'a'.repeat(40);
const author = login => ({ user: login ? { login } : null });
const authors = (logins, more = false) => ({ nodes: logins.map(author), pageInfo: { hasNextPage: more } });
const commit = (logins, more = false) => ({ commit: { oid: sha, authors: authors(logins, more) } });
const pr = (nodes = [commit(['Reasonofmoon', 'Collaborator'])], extra = {}) => ({ url: 'https://github.com/Reasonofmoon/coop-quest/pull/1', title: 'Real work', mergedAt: date, author: { login: 'SomeoneElse' }, commits: { nodes, pageInfo: { hasNextPage: false } }, ...extra });
const response = (nodes, flags = {}) => ({ data: { repository: { pullRequests: { nodes, pageInfo: { hasNextPage: false, hasPreviousPage: false, ...flags } } } } });
const parse = r => parseGraphQL(r, 'Reasonofmoon', 'Reasonofmoon/coop-quest', date);

test('one unique PR with same-commit linked authors; PR author is not evidence', () => {
  const p = parse(response([pr(), pr()]));
  assert.equal(p.pullRequests.length, 1);
  assert.equal(p.pullRequests[0].authorLogin, 'SomeoneElse');
  assert.deepEqual(p.pullRequests[0].coauthors, ['Reasonofmoon', 'Collaborator']);
  assert.equal(p.pullRequests[0].commitSha, sha);
});
test('case-insensitive dedup; same author twice is not a coauthor', () => {
  assert.equal(parse(response([pr([commit(['Reasonofmoon', 'reasonofmoon'])])])).pullRequests.length, 0);
  const p = parse(response([pr([commit(['REASONOFMOON', 'Collaborator', 'collaborator'])])]));
  assert.deepEqual(p.pullRequests[0].coauthors, ['Reasonofmoon', 'Collaborator']);
});
test('separate commits are not coauthored; unlinked/null users never qualify', () => {
  assert.equal(parse(response([pr([commit(['Reasonofmoon']), commit(['Collaborator'])])])).pullRequests.length, 0);
  assert.equal(parse(response([pr([commit(['Reasonofmoon', null])])])).pullRequests.length, 0);
  assert.equal(parse(response([pr([commit([null, 'Collaborator'])])])).pullRequests.length, 0);
});
test('deleted/null PR author remains nullable metadata', () => {
  assert.equal(parse(response([pr(undefined, { author: null })])).pullRequests[0].authorLogin, null);
});
test('malformed JSON, GraphQL partial errors and missing connections fail closed', () => {
  for (const raw of ['{', null, { errors: [{ message: 'not disclosed' }], data: response([]).data }, response([{ ...pr(), commits: null }]), { data: { repository: null } }]) assert.throws(() => parse(raw));
  assert.throws(() => parse(response([pr([{ commit: { oid: sha, authors: null } }])])));
});
test('pagination flags from every connection are preserved; coverage always partial', () => {
  const truncatedResponses = [
    response([pr()], { hasNextPage: true }),
    response([pr()], { hasPreviousPage: true }),
    response([pr(undefined, { commits: { nodes: [commit(['Reasonofmoon', 'Collaborator'])], pageInfo: { hasNextPage: true } } })]),
    response([pr([commit(['Reasonofmoon', 'Collaborator'], true)])]),
  ];
  for (const r of truncatedResponses) assert.equal(parse(r).coverage.truncated, true);
  assert.equal(parse(response([pr()])).coverage.complete, false);
  assert.equal(parse(response([])).coverage.truncated, false);
});
test('export uses shared schema and whitelist, not names/emails/token fields', () => {
  const d = parse(response([pr(undefined, { title: 'A\u001b[31m title', email: 'ignored' })]));
  d.token = 'ignored'; d.pullRequests[0].name = 'ignored';
  const result = JSON.parse(exportJSON(d));
  assert.deepEqual(Object.keys(result).sort(), ['coverage', 'player', 'pullRequests', 'scannedAt', 'schemaVersion', 'source'].sort());
  assert.deepEqual(Object.keys(result.pullRequests[0]).sort(), ['url', 'title', 'mergedAt', 'authorLogin', 'coauthors', 'evidence', 'commitSha'].sort());
  assert.equal(result.coverage.scope, 'repo Reasonofmoon/coop-quest last100 mergedPR');
  assert.equal(result.pullRequests[0].title.includes('\u001b'), false);
  assert.equal(datasetOf({ ...result, coverage: { ...result.coverage, complete: true } }), null);
});
test('milestones and local XP start from zero, never an assumed silver baseline', () => {
  assert.deepEqual(MILESTONES, [1, 10, 24, 48]);
  assert.deepEqual(progress(0), { count: 0, xp: 0, level: 1, levelXP: 0, reached: [], nextMilestone: 1 });
  assert.equal(progress(3).level, 2);
  assert.equal(progress(10).levelXP, 100);
  assert.deepEqual(progress(24).reached, [1, 10, 24]);
  assert.equal(progress(48).nextMilestone, null);
});
test('repository/login input rejects argument injection and invalid paths', () => {
  for (const repo of ['--help/x', 'a/b/c', 'a/..', 'a/b c', 'a/$(x)', 'a--b/c']) assert.throws(() => parseRepo(repo));
  assert.equal(validLogin('-a'), false);
  assert.equal(parseRepo('Reasonofmoon/coop-quest').name, 'coop-quest');
});
test('no automatic/private fetch: only explicit human scan can plan a scan', () => {
  assert.equal(commandPlan('', 'agent', 'casual').action, 'show');
  for (const action of ['scan private/repo', 'export', 'clear']) assert.throws(() => commandPlan(action, 'agent', 'casual'));
  assert.equal(commandPlan('scan private/repo', 'composer', 'casual').repo, 'private/repo');
  assert.equal(commandPlan('scan private/repo', 'bridge', 'off').action, 'off');
});
test('SDK TypeScript mirror equals tested core, and query bounds are fixed', async () => {
  const [ts, js] = await Promise.all([readFile(new URL('./core.ts', import.meta.url), 'utf8'), readFile(new URL('./coop-core.mjs', import.meta.url), 'utf8')]);
  assert.equal(ts.split('\n').slice(2).join('\n'), js);
  assert.match(QUERY, /pullRequests\(last:100,states:MERGED/);
  assert.match(QUERY, /commits\(first:100\)/);
  assert.match(QUERY, /authors\(first:20\)/);
});
test('registration contains no automatic scan hooks or background timers', async () => {
  const s = await readFile(new URL('./register.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(s, /on\('(?:tool\.call|turn\.complete|prompt\.submit)'/);
  assert.doesNotMatch(s, /setInterval|setTimeout|\$\.clock\.after|\$\.env\.get/);
  assert.equal((s.match(/await scan\(\$/g) ?? []).length, 1);
  assert.ok(s.indexOf('commandPlan(e.args, e.origin.kind, intensity)') < s.indexOf('await scan($'));
});
