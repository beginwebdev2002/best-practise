import { test, mock } from 'node:test';
import assert from 'node:assert';
import { sleep } from '../.github/scripts/utils.js';

test('sleep utility function', async (t) => {
  mock.timers.enable({ apis: ['setTimeout'] });

  let resolved = false;
  const sleepPromise = sleep(1000).then(() => {
    resolved = true;
  });

  // Verify that the promise hasn't resolved yet
  assert.strictEqual(resolved, false);

  // Advance timers by 999ms, the promise should still be unresolved
  mock.timers.tick(999);
  // Yield to the event loop so promises can resolve
  await Promise.resolve();
  assert.strictEqual(resolved, false);

  // Advance by 1 more ms to reach 1000ms
  mock.timers.tick(1);
  // Yield to the event loop
  await Promise.resolve();
  // Ensure that the promise does eventually resolve
  await sleepPromise;

  assert.strictEqual(resolved, true);

  mock.timers.reset();
});
