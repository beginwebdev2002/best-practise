import test from 'node:test';
import assert from 'node:assert';
import { randomText } from '../.github/scripts/utils.js';

test('randomText should generate a string of length 35', () => {
    const text = randomText();
    assert.strictEqual(typeof text, 'string', 'Generated text should be a string');
    assert.strictEqual(text.length, 35, 'Generated string should have a length of exactly 35 characters');
});

test('randomText should generate random strings', () => {
    const text1 = randomText();
    const text2 = randomText();
    assert.notStrictEqual(text1, text2, 'Consecutive calls should generate different strings');
});

test('randomText should only contain specified symbols', () => {
    const text = randomText();
    const allowedSymbols = /^[0-9a-z]{35}$/;
    assert.match(text, allowedSymbols, 'String should only contain numbers and lowercase letters (except 4)');
});
