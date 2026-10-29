import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'
import type { CoopBook, CoopDataset } from './types'
import { bar, intensityOf, paletteOf, windowProps } from './palette'
import { QUERY, commandPlan, datasetOf, exportJSON, parseGraphQL, parseRepo, progress, validLogin } from './core'

const PANE = 'coop-quest'
const EMPTY: CoopBook = { dataset: null, seen: [], toasted: [] }
const book = atom({ plugin: 'game-coop-quest', key: 'book' } as const, EMPTY)

export const register: Register = (on, options) => {
  const intensity = intensityOf(options.intensity)
  const pal = paletteOf(options.palette)
  const playerOption = typeof options.player === 'string' ? options.player.trim() : ''
  let key = 'book'
  let busy = false
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    await $.command.register({ name: 'coop-quest', description: 'Local linked-author PR quest; explicit scan only (beta)', argumentHint: '[scan OWNER/REPO|export|clear]' })
    if (intensity !== 'off') {
      key = 'book:' + await $.session.root()
      const kept = bookOf(await $.store.get(key))
      await update($, book, () => kept)
    }
    return result
  }).catch(($, e, next) => next(e))

  on('command.run', { command: 'coop-quest' }, async ($, e) => {
    let plan
    try { plan = commandPlan(e.args, e.origin.kind, intensity) } catch (err) { return { text: safeCommandError(err) } }
    if (plan.action === 'off') return { text: 'COOP QUEST is off. No scan, recording or drawing was performed.' }
    if (plan.action === 'show') {
      if (intensity !== 'off') await $.ui.open({ id: PANE, title: 'COOP QUEST' })
      return { text: summary((await read($, book)).dataset) }
    }
    if (busy) return { text: 'A local scan is in progress. Wait before scanning, exporting or clearing.' }
    if (plan.action === 'clear') {
      if (key === 'book') key = 'book:' + await $.session.root()
      await keep($, key, EMPTY)
      return { text: 'Local COOP QUEST record cleared. GitHub was not changed.' }
    }
    if (plan.action === 'export') {
      const current = (await read($, book)).dataset
      if (!current) return { text: 'No local scan to export. Type /coop-quest scan OWNER/REPO first.' }
      return { text: 'LOCAL EXPORT: may contain private repository PR URLs and titles. Share only after reviewing. No file was uploaded.\n' + exportJSON(current) }
    }
    busy = true
    try {
      const dataset = await scan($, plan.repo, playerOption)
      const current = await read($, book)
      const scope = dataset.player.toLowerCase() + ':' + dataset.coverage.scope.toLowerCase()
      const ids = dataset.pullRequests.map(pr => dataset.player.toLowerCase() + ':' + pr.url.toLowerCase())
      const newCount = ids.filter(id => !current.seen.includes(id)).length
      const milestones = progress(dataset.pullRequests.length).reached.map(n => scope + ':' + n)
      const firstTiers = milestones.filter(id => !current.toasted.includes(id))
      const nextBook: CoopBook = { dataset, seen: [...new Set([...current.seen, ...ids])], toasted: [...new Set([...current.toasted, ...milestones])] }
      await keep($, key, nextBook)
      if (newCount > 0) await $.ui.toast('COOP QUEST: ' + newCount + ' newly observed linked-author PR(s)', { timeoutMs: 5000 })
      for (const tier of firstTiers) await $.ui.toast('Local community milestone: ' + tier.split(':').pop() + ' PR(s). Not an official badge.', { timeoutMs: 5000 })
      await $.ui.open({ id: PANE, title: 'COOP QUEST' })
      return { text: summary(dataset) + '\nNewly observed in local history: ' + newCount + '. No GitHub writes were made.' }
    } catch {
      return { text: 'Scan could not finish. Check that gh is already installed/authenticated and this repository is accessible. This surface may not support local processes. No install or login was attempted; no raw errors were disclosed.' }
    } finally { busy = false }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e, next) => {
    if (intensity === 'off') return next(e)
    const { Box, Text } = $.ui.resolve(e)
    const current = (await read($, book)).dataset
    const p = progress(current?.pullRequests.length ?? 0)
    return <Box {...windowProps(pal)} flexDirection="column">
      <Text color={pal.title} bold>COOP QUEST · LOCAL RPG</Text>
      <Text color={pal.text}>LV {p.level} · XP {p.xp} · {p.count} observed eligible PR(s)</Text>
      <Text color={pal.ok}>{bar(p.levelXP / 300 * 100, 12)} {p.levelXP}/300 XP</Text>
      <Text color={pal.warn}>Badge status unknown. No assumed 24-PR baseline.</Text>
      <Text color={pal.dim}>Community checkpoints 1 / 10 / 24 / 48, not GitHub counters.</Text>
      <Text color={pal.info}>{p.nextMilestone === null ? 'Local 48 checkpoint reached' : 'Next local checkpoint: ' + p.nextMilestone}</Text>
      <Text color={pal.dim}>{current ? current.coverage.scope : 'No scan yet. Type /coop-quest scan OWNER/REPO'}</Text>
      <Text color={pal.warn}>Partial repo dataset, never account totals{current?.coverage.truncated ? ' · pagination truncated' : ''}</Text>
      {current && <Text color={pal.dim}>Player {current.player} · scanned {current.scannedAt}</Text>}
      <Text color={pal.text}>Same commit: player + another distinct linked GitHub login.</Text>
      {intensity === 'hardcore' && current?.pullRequests.slice(0, 8).map(pr => <Text key={pr.url} color={pal.text} wrap="truncate-end">{pr.title}</Text>)}
      <Text color={pal.dim}>Keyboard: /coop-quest [scan OWNER/REPO|export|clear]</Text>
    </Box>
  })
}

async function gh($: EngineInterface, args: string[]): Promise<string> {
  const result = await $.process.run(['gh', ...args], { timeoutMs: 20000 })
  if (result.exitCode !== 0 || typeof result.stdout !== 'string') throw new Error('Local gh failed')
  return result.stdout
}
async function scan($: EngineInterface, requestedRepo: string | undefined, configuredPlayer: string): Promise<CoopDataset> {
  let repo = requestedRepo
  if (!repo) {
    const discovered = JSON.parse(await gh($, ['repo', 'view', '--json', 'nameWithOwner']))
    repo = discovered?.nameWithOwner
  }
  const target = parseRepo(repo)
  const player = configuredPlayer || (await gh($, ['api', 'user', '--jq', '.login'])).trim()
  if (!validLogin(player)) throw new Error('Invalid player')
  const raw = await gh($, ['api', 'graphql', '-f', 'query=' + QUERY, '-F', 'owner=' + target.owner, '-F', 'name=' + target.name])
  return parseGraphQL(raw, player, target.fullName, new Date(await $.clock.now()).toISOString()) as CoopDataset
}
async function keep($: EngineInterface, key: string, value: CoopBook): Promise<void> {
  await $.store.set(key, value)
  await update($, book, () => value)
  await $.ui.invalidate('ui.render')
}
function bookOf(value: unknown): CoopBook {
  if (!value || typeof value !== 'object') return EMPTY
  const v = value as Partial<CoopBook>
  return { dataset: datasetOf(v.dataset) as CoopDataset | null, seen: safeIds(v.seen), toasted: safeIds(v.toasted) }
}
function safeIds(value: unknown): string[] {
  return Array.isArray(value) ? [...new Set(value.filter((s): s is string => typeof s === 'string' && s.length < 500 && !/[\u0000-\u001f]/.test(s)))] : []
}
function safeCommandError(value: unknown): string {
  return value instanceof Error ? value.message : 'Use /coop-quest [scan OWNER/REPO|export|clear].'
}
function summary(dataset: CoopDataset | null): string {
  const p = progress(dataset?.pullRequests.length ?? 0)
  return 'COOP QUEST · LV ' + p.level + ' · XP ' + p.xp + ' · ' + p.count + ' observed eligible PR(s)\nPartial local repo sample, not account totals. Badge status unknown; 1/10/24/48 are community checkpoints, not official counters.'
}
