import { expect, mock, test } from 'claude-code/testing'
import type { On, RenderElement } from 'claude-code'

function world(on: On) {
  mock.store(on, {})
  mock.clock(on, { now: 1_793_232_000_000 })
  const opened: string[] = []
  const calls: unknown[] = []
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('session.root', () => ({ value: '/proj' }))
  on('command.register', (_, e) => ({ value: { command: e.name } }))
  on('ui.open', (_, e) => { opened.push(e.id); return { value: { isPlaced: true as const } } })
  // If startup/default/agent commands accidentally scan, fail without a private fetch.
  on('process.run', (_, e) => { calls.push(e); throw new Error('Unexpected process') })
  on('ui.render', ($, e) => { const { Text } = $.ui.resolve(e); return h(Text, {}, 'engine') as RenderElement })
  return { opened, calls }
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
