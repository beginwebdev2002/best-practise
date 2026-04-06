import { describe, it } from 'node:test';
import assert from 'node:assert';
import { parseJson } from '../.github/scripts/utils.js';

describe('utils.js', () => {
    describe('parseJson', () => {
        it('should return null for empty or non-string inputs', () => {
            assert.strictEqual(parseJson(null), null);
            assert.strictEqual(parseJson(undefined), null);
            assert.strictEqual(parseJson(''), null);
            assert.strictEqual(parseJson(123), null);
            assert.strictEqual(parseJson({}), null);
            assert.strictEqual(parseJson([]), null);
        });

        it('should parse valid JSON', () => {
            const result = parseJson('{"key": "value"}');
            assert.deepStrictEqual(result, { key: "value" });
        });

        it('should strip markdown formatting', () => {
            const result = parseJson('```json\n{"key": "value"}\n```');
            assert.deepStrictEqual(result, { key: "value" });
        });

        it('should ignore text before and after json', () => {
            const result = parseJson('Here is the data: {"key": "value"} have a nice day.');
            assert.deepStrictEqual(result, { key: "value" });
        });

        it('should return null for invalid JSON string', () => {
            const result = parseJson('{"key": "value"');
            assert.strictEqual(result, null);
        });
    });
});
