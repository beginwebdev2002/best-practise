import { test } from 'node:test';
import assert from 'node:assert';
import { convertGcsUriToPublicUrl } from './utils.js';

test('convertGcsUriToPublicUrl should convert standard gs:// URI to public URL', () => {
    const input = 'gs://bucket/file.png';
    const expected = 'https://storage.googleapis.com/bucket/file.png';
    const actual = convertGcsUriToPublicUrl(input);
    assert.strictEqual(actual, expected);
});

test('convertGcsUriToPublicUrl should convert gs:// URI with subdirectories', () => {
    const input = 'gs://my-bucket-name/folder/subfolder/image.jpg';
    const expected = 'https://storage.googleapis.com/my-bucket-name/folder/subfolder/image.jpg';
    const actual = convertGcsUriToPublicUrl(input);
    assert.strictEqual(actual, expected);
});

test('convertGcsUriToPublicUrl should return undefined path on invalid input without gs://', () => {
    const input = 'http://example.com/file.png';
    const actual = convertGcsUriToPublicUrl(input);
    assert.strictEqual(actual, 'https://storage.googleapis.com/undefined');
});

test('convertGcsUriToPublicUrl should throw on null/undefined input', () => {
    assert.throws(() => {
        convertGcsUriToPublicUrl(null);
    }, TypeError);

    assert.throws(() => {
        convertGcsUriToPublicUrl(undefined);
    }, TypeError);
});
