import { test, mock } from 'node:test';
import assert from 'node:assert';
import { sleep } from '../.github/scripts/utils.js';

test('sleep resolves after specified timeout', async (t) => {
    mock.timers.enable({ apis: ['setTimeout'] });
    t.after(() => mock.timers.reset());

    let resolved = false;
    const promise = sleep(1000).then(() => { resolved = true; });

    assert.strictEqual(resolved, false);

    mock.timers.tick(500);
    await Promise.resolve();
    assert.strictEqual(resolved, false);

    mock.timers.tick(500);
    await promise;
    assert.strictEqual(resolved, true);
});
