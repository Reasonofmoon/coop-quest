import { expect, mock, test } from 'claude-code/testing'
import type { On, RenderElement } from 'claude-code'

function world(on: On, graphql?: unknown) {
  mock.store(on, {})
  mock.clock(on, { now: 1_793_232_000_000 })
  const opened: string[] = []
  const calls: string[][] = []
  const toasts: string[] = []
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('session.root', () => ({ value: '/proj' }))
  on('command.register', (_, e) => ({ value: { command: e.name } }))
  on('ui.open', (_, e) => { opened.push(e.id); return { value: { isPlaced: true as const } } })
  // If startup/default/agent commands accidentally scan, fail without a private fetch.
  on('process.run', (_, e) => {
    calls.push(e.argv)
    const out = (stdout: string) => ({ value: { exitCode: 0, stdout, stderr: '', isStdoutTruncated: false, isStderrTruncated: false } })
    if (graphql !== undefined && e.argv.join(' ') === 'gh api user --jq .login') return out('Reasonofmoon\n')
    if (graphql !== undefined && e.argv[0] === 'gh' && e.argv[1] === 'api' && e.argv[2] === 'graphql') return out(JSON.stringify(graphql))
    throw new Error('Unexpected process')
  })
  on('ui.toast', (_, e) => { toasts.push(e.text); return { value: undefined } })
  on('ui.render', ($, e) => { const { Text } = $.ui.resolve(e); return h(Text, {}, 'engine') as RenderElement })
  return { opened, calls, toasts }
}
function command(args = '') { return { command: 'coop-quest', args, origin: { kind: 'composer' as const }, presentation: { isFullscreen: false, columns: 120 } } }
function pane(surface: 'terminal' | 'desktop') { return { plugin: 'game-coop-quest', surface, component: 'Pane' as const, requestId: 'coop-quest', props: { title: 'COOP QUEST', isFocused: false, bodyColumns: 60, placement: 'inline' as const, scroll: { offset: 0, bodyRows: 15 }, view: {} } } }

test('startup and default keyboard command show empty honest progress without a process', async ($, on) => {
  const state = world(on)
  await $.session.start({ cwd: '/proj', surface: 'terminal', isInteractive: true })
  expect((await $.command.run(command())).text).toContain('XP 0')
  expect(state.opened).toEqual(['coop-quest'])
  expect(state.calls).toEqual([])
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount(pane(surface))
    const text = (await ui.findAll({ type: 'Text' })).map(t => t.text).join('\n')
    expect(text).toContain('Badge status unknown')
    expect(text).toContain('never account totals')
    await ui.unmount()
  }
})

test('off mode does not draw or scan and user clear remains local', { options: { intensity: 'off' } }, async ($, on) => {
  const state = world(on)
  await $.session.start({ cwd: '/proj', surface: 'terminal', isInteractive: true })
  expect((await $.command.run(command('scan owner/private'))).text).toContain('No scan')
  expect((await $.command.run(command('clear'))).text).toContain('GitHub was not changed')
  expect(state.opened).toEqual([])
  expect(state.calls).toEqual([])
})


test('explicit read-only scan, export and repeated-scan dedup work through the SDK', async ($, on) => {
  const date = '2026-10-29T00:00:00.000Z'
  const row = { url: 'https://github.com/Reasonofmoon/coop-quest/pull/1', title: 'Synthetic SDK fixture only', mergedAt: date, author: null, commits: { pageInfo: { hasNextPage: false }, nodes: [{ commit: { oid: 'a'.repeat(40), authors: { pageInfo: { hasNextPage: false }, nodes: [{ user: { login: 'Reasonofmoon' } }, { user: { login: 'TestTeammate' } }] } } }] } }
  const fixture = { data: { repository: { pullRequests: { pageInfo: { hasNextPage: false, hasPreviousPage: false }, nodes: [row, row] } } } }
  const state = world(on, fixture)
  await $.session.start({ cwd: '/proj', surface: 'terminal', isInteractive: true })
  const scanned = await $.command.run(command('scan Reasonofmoon/coop-quest'))
  expect(scanned.text).toContain('XP 100')
  expect(scanned.text).toContain('1 observed eligible PR(s)')
  expect(state.calls).toHaveLength(2)
  expect(state.calls[1].slice(0, 3)).toEqual(['gh', 'api', 'graphql'])
  const toastCount = state.toasts.length
  expect(toastCount).toBe(2)
  await $.command.run(command('scan Reasonofmoon/coop-quest'))
  expect(state.toasts).toHaveLength(toastCount)
  const exported = await $.command.run(command('export'))
  expect(exported.text).toContain('may contain private repository')
  const data = JSON.parse((exported.text ?? '').split('\n').slice(1).join('\n'))
  expect(data.pullRequests).toHaveLength(1)
  expect(data.pullRequests[0].authorLogin).toBe(null)
  expect(data.pullRequests[0].coauthors).toEqual(['Reasonofmoon', 'TestTeammate'])
  expect(data.coverage.complete).toBe(false)
  expect(data.source).toBe('graphql')
})
