import test from 'node:test';
import assert from 'node:assert/strict';
import { createFlashPlayback, flashPlaybackPlan } from '../src/scripts/lab/flash-playback.mjs';

function setup(count = 7, interval = 700) {
  let now = 0;
  let id = 0;
  const tasks = new Map();
  const changes = [];
  const player = createFlashPlayback({ count, interval,
    schedule(callback, delay) { tasks.set(++id, { callback, at: now + delay }); return id; },
    cancel(task) { tasks.delete(task); },
    onChange(state, message) { changes.push({ ...state, message, at: now }); },
  });
  const run = () => {
    while (tasks.size) {
      const [taskId, task] = [...tasks.entries()].sort((a, b) => a[1].at - b[1].at)[0];
      tasks.delete(taskId);
      now = task.at;
      task.callback();
    }
  };
  return { player, tasks, changes, run, now: () => now };
}

test('a sequence stays static until explicitly started, and restarting begins at the first image', () => {
  const p = setup();
  assert.equal(p.tasks.size, 0);
  p.player.step(1);
  assert.equal(p.player.state().index, 1);
  p.player.play();
  assert.equal(p.player.state().index, 0);
  assert.equal(p.tasks.size, 1);
  p.player.stop();
  assert.equal(p.tasks.size, 0);
  assert.equal(p.player.state().playing, false);
});

test('all supported intervals obey the maximum runtime even with 100 source frames', () => {
  for (const interval of [450, 700, 1000]) {
    const p = setup(100, interval);
    p.player.play();
    p.run();
    assert.ok(p.now() <= 30_000);
    assert.equal(p.player.state().playing, false);
    assert.equal(p.player.state().index, flashPlaybackPlan(100, interval).frames - 1);
    assert.equal(p.tasks.size, 0);
  }
});

test('visibility and reduced-motion blockers stop playback and never restart it automatically', () => {
  const p = setup();
  p.player.play();
  p.player.setBlocker('motion', true, 'Reduced motion');
  assert.equal(p.tasks.size, 0);
  assert.equal(p.player.play(), false);
  p.player.step(1);
  assert.equal(p.player.state().index, 1);
  p.player.setBlocker('motion', false, '');
  assert.equal(p.tasks.size, 0);
  p.player.play();
  p.player.setBlocker('viewport', true, 'Offscreen');
  p.player.setBlocker('document', true, 'Background');
  p.player.setBlocker('viewport', false, '');
  assert.equal(p.player.play(), false);
  p.player.setBlocker('document', false, '');
  assert.equal(p.tasks.size, 0);
});

test('timing changes and disposal clear pending work; manual stepping remains available', () => {
  const p = setup();
  p.player.play();
  p.player.setInterval(450);
  assert.equal(p.tasks.size, 0);
  assert.equal(p.player.state().interval, 450);
  p.player.step(-1);
  assert.equal(p.player.state().index, 6);
  p.player.reset();
  assert.equal(p.player.state().index, 0);
  p.player.play();
  p.player.destroy();
  assert.equal(p.tasks.size, 0);
  assert.equal(p.player.play(), false);
});
