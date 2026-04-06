import test from 'node:test';
import assert from 'node:assert';
import { convertGcsUriToPublicUrl } from '../.github/scripts/utils.js';

test('convertGcsUriToPublicUrl - valid URI', () => {
    const uri = 'gs://my-bucket/my-file.txt';
    const expectedUrl = 'https://storage.googleapis.com/my-bucket/my-file.txt';
    assert.strictEqual(convertGcsUriToPublicUrl(uri), expectedUrl);
});

test('convertGcsUriToPublicUrl - invalid URI format (does not start with gs://)', () => {
    const invalidUri = 'https://my-bucket/my-file.txt';
    assert.throws(
        () => convertGcsUriToPublicUrl(invalidUri),
        /Invalid GCS URI: Must be a string starting with "gs:\/\/"/
    );
});

test('convertGcsUriToPublicUrl - invalid type (not a string)', () => {
    assert.throws(
        () => convertGcsUriToPublicUrl(12345),
        /Invalid GCS URI: Must be a string starting with "gs:\/\/"/
    );

    assert.throws(
        () => convertGcsUriToPublicUrl(null),
        /Invalid GCS URI: Must be a string starting with "gs:\/\/"/
    );

    assert.throws(
        () => convertGcsUriToPublicUrl(undefined),
        /Invalid GCS URI: Must be a string starting with "gs:\/\/"/
    );
});
