import { describe, it } from 'node:test';
import assert from 'node:assert';
import { convertGcsUriToPublicUrl } from '../.github/scripts/utils.js';

describe('convertGcsUriToPublicUrl', () => {
    it('should convert valid gs:// URI to public URL', () => {
        const uri = 'gs://my-bucket/path/to/file.png';
        const expected = 'https://storage.googleapis.com/my-bucket/path/to/file.png';
        assert.strictEqual(convertGcsUriToPublicUrl(uri), expected);
    });

    it('should throw Error for invalid string missing gs:// prefix', () => {
        const uri = 'invalid-uri-no-prefix';
        assert.throws(() => {
            convertGcsUriToPublicUrl(uri);
        }, Error);
    });

    it('should throw Error when passed null', () => {
        assert.throws(() => {
            convertGcsUriToPublicUrl(null);
        }, Error);
    });

    it('should throw Error when passed undefined', () => {
        assert.throws(() => {
            convertGcsUriToPublicUrl(undefined);
        }, Error);
    });

    it('should throw Error when passed an empty string', () => {
        assert.throws(() => {
            convertGcsUriToPublicUrl('');
        }, Error);
    });
});
