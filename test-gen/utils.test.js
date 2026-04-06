import test from 'node:test';
import assert from 'node:assert';
import { sleep } from '../.github/scripts/utils.js';

test('sleep function', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });

  let resolved = false;
  const p = sleep(100).then(() => {
    resolved = true;
  });

  assert.strictEqual(resolved, false, 'Should not resolve immediately');

  t.mock.timers.tick(50);
  assert.strictEqual(resolved, false, 'Should not resolve before timeout');

  t.mock.timers.tick(50);

  // Wait for microtasks
  await Promise.resolve();

  assert.strictEqual(resolved, true, 'Should resolve after timeout');
});
