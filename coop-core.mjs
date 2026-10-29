// Pure evidence logic. No process, network, environment, token, or file access.
export const MILESTONES = [1, 10, 24, 48];
export const QUERY = 'query CoopQuest($owner:String!,$name:String!){repository(owner:$owner,name:$name){pullRequests(last:100,states:MERGED,orderBy:{field:UPDATED_AT,direction:ASC}){pageInfo{hasPreviousPage hasNextPage} nodes{url title mergedAt author{login} commits(first:100){pageInfo{hasNextPage} nodes{commit{oid authors(first:20){pageInfo{hasNextPage} nodes{user{login}}}}}}}}}}';
const LOGIN = /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i;
const REPO = /^[A-Za-z\d_.-]{1,100}$/;
export function validLogin(value) { return typeof value === 'string' && LOGIN.test(value) && !value.includes('--'); }
export function parseRepo(value) {
  if (typeof value !== 'string') throw new Error('Invalid repository. Use OWNER/REPO.');
  const parts = value.split('/');
  if (parts.length !== 2 || !validLogin(parts[0]) || !REPO.test(parts[1]) || parts[1] === '.' || parts[1] === '..') throw new Error('Invalid repository. Use OWNER/REPO.');
  return { owner: parts[0], name: parts[1], fullName: parts.join('/') };
}
export function commandPlan(args, origin, intensity) {
  const parts = String(args ?? '').trim().split(/\s+/).filter(Boolean);
  const action = parts[0]?.toLowerCase() ?? 'show';
  if (!['show', 'scan', 'export', 'clear'].includes(action) || (action !== 'scan' && parts.length > 1) || parts.length > 2) throw new Error('Use /coop-quest [scan OWNER/REPO|export|clear].');
  if (action !== 'show' && origin !== 'composer' && origin !== 'bridge') throw new Error('Only you can scan, export or clear: type the command yourself.');
  if (intensity === 'off' && action !== 'clear') return { action: 'off' };
  if (action === 'scan' && parts[1]) parseRepo(parts[1]);
  return { action, repo: action === 'scan' ? parts[1] : undefined };
}
function object(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }
function connection(v) {
  if (!object(v) || !Array.isArray(v.nodes) || !object(v.pageInfo) || typeof v.pageInfo.hasNextPage !== 'boolean') throw new Error('Incomplete GitHub response; nothing was saved.');
  return v;
}
function iso(v) { return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v) && Number.isFinite(Date.parse(v)); }
function cleanTitle(v) { return typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').slice(0, 500) : ''; }
function validURL(v, repo) {
  if (typeof v !== 'string') return false;
  const prefix = 'https://github.com/' + repo.toLowerCase() + '/pull/';
  return v.toLowerCase().startsWith(prefix) && /^\d+$/.test(v.slice(prefix.length));
}
function linked(authors) {
  const found = new Map();
  for (const a of authors.nodes) if (validLogin(a?.user?.login)) {
    const login = a.user.login;
    if (!found.has(login.toLowerCase())) found.set(login.toLowerCase(), login);
  }
  return [...found.values()];
}
export function parseGraphQL(raw, player, repository, scannedAt) {
  if (!validLogin(player)) throw new Error('Invalid player login.');
  const repo = parseRepo(repository).fullName;
  if (!iso(scannedAt)) throw new Error('Invalid scan date.');
  let response;
  try { response = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { throw new Error('GitHub returned invalid JSON; nothing was saved.'); }
  if (!object(response) || (response.errors !== undefined && (!Array.isArray(response.errors) || response.errors.length > 0)) || !object(response.data?.repository)) throw new Error('GitHub query failed; check repository access and existing gh login.');
  const prs = connection(response.data.repository.pullRequests);
  let truncated = prs.pageInfo.hasNextPage || prs.pageInfo.hasPreviousPage === true;
  const eligible = new Map();
  for (const pr of prs.nodes) {
    if (!object(pr)) continue;
    const commits = connection(pr.commits);
    truncated ||= commits.pageInfo.hasNextPage;
    let evidence;
    for (const node of commits.nodes) {
      if (!object(node?.commit)) continue;
      const commit = node.commit;
      const authors = connection(commit.authors);
      truncated ||= authors.pageInfo.hasNextPage;
      const logins = linked(authors);
      const hasPlayer = logins.some(l => l.toLowerCase() === player.toLowerCase());
      if (!evidence && hasPlayer && logins.length > 1 && typeof commit.oid === 'string' && /^[a-f\d]{7,64}$/i.test(commit.oid)) evidence = { coauthors: logins.map(l => l.toLowerCase() === player.toLowerCase() ? player : l), commitSha: commit.oid };
    }
    if (evidence && validURL(pr.url, repo) && iso(pr.mergedAt)) {
      const key = pr.url.toLowerCase();
      if (!eligible.has(key)) eligible.set(key, { url: pr.url, title: cleanTitle(pr.title), mergedAt: pr.mergedAt, authorLogin: validLogin(pr.author?.login) ? pr.author.login : null, ...evidence, evidence: 'linked-authors' });
    }
  }
  return { schemaVersion: 1, player, source: 'graphql', scannedAt, coverage: { complete: false, scope: 'repo ' + repo + ' last100 mergedPR', truncated: Boolean(truncated) }, pullRequests: [...eligible.values()] };
}
export function progress(count) {
  const eligible = Math.max(0, Math.floor(Number.isFinite(count) ? count : 0));
  const xp = eligible * 100;
  return { count: eligible, xp, level: 1 + Math.floor(xp / 300), levelXP: xp % 300, reached: MILESTONES.filter(n => eligible >= n), nextMilestone: MILESTONES.find(n => eligible < n) ?? null };
}
// Revalidate local JSON and whitelist every exported field; no imported counter is trusted.
export function datasetOf(value) {
  if (!object(value) || value.schemaVersion !== 1 || value.source !== 'graphql' || !validLogin(value.player) || !iso(value.scannedAt) || !object(value.coverage) || value.coverage.complete !== false || typeof value.coverage.truncated !== 'boolean' || !Array.isArray(value.pullRequests)) return null;
  const match = /^repo (\S+) last100 mergedPR$/.exec(value.coverage.scope ?? '');
  if (!match) return null;
  let repo; try { repo = parseRepo(match[1]).fullName; } catch { return null; }
  const seen = new Set(); const pullRequests = [];
  for (const p of value.pullRequests) {
    if (!object(p) || !validURL(p.url, repo) || !iso(p.mergedAt) || p.evidence !== 'linked-authors' || !Array.isArray(p.coauthors) || typeof p.commitSha !== 'string' || !/^[a-f\d]{7,64}$/i.test(p.commitSha)) continue;
    const coauthors = [...new Map(p.coauthors.filter(validLogin).map(l => [l.toLowerCase(), l])).values()];
    if (coauthors.length < 2 || !coauthors.some(l => l.toLowerCase() === value.player.toLowerCase()) || seen.has(p.url.toLowerCase())) continue;
    seen.add(p.url.toLowerCase());
    pullRequests.push({ url: p.url, title: cleanTitle(p.title), mergedAt: p.mergedAt, authorLogin: validLogin(p.authorLogin) ? p.authorLogin : null, coauthors, evidence: 'linked-authors', commitSha: p.commitSha });
  }
  return { schemaVersion: 1, player: value.player, source: 'graphql', scannedAt: value.scannedAt, coverage: { complete: false, scope: 'repo ' + repo + ' last100 mergedPR', truncated: value.coverage.truncated }, pullRequests };
}
export function exportJSON(dataset) {
  const safe = datasetOf(dataset);
  if (!safe) throw new Error('No valid local scan to export.');
  return JSON.stringify(safe, null, 2);
}
