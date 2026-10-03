import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateContent, assertSameOrigin } from '../lib/validation.mjs';

test('accepts Shan text and multiline post content', () => {
  const item = validateContent('posts', { title: '  တႆး  ', excerpt: 'A guide', content: ['First', 'Second'], image: '' });
  assert.equal(item.title, 'တႆး');
  assert.equal(item.image, '/img/hero.png');
  assert.deepEqual(item.content, ['First', 'Second']);
});
test('blocks script URLs, protocol-relative images, and non-URL links', () => {
  for (const link of ['javascript:alert(1)', 'data:text/html,hi', '//evil.test', '#', '']) {
    assert.throws(() => validateContent('products', { title: 'Tool', description: 'Test', link }));
  }
  assert.throws(() => validateContent('posts', { image: '//evil.test/img.png' }, true));
});
test('cannot overwrite IDs or protected columns', () => {
  for (const key of ['id', 'created_at', 'user_id', '__proto__']) {
    assert.throws(() => validateContent('posts', JSON.parse(`{"${key}":"changed"}`), true));
  }
});
test('requires complete creates but allows partial updates', () => {
  assert.throws(() => validateContent('posts', { title: 'Only a title' }));
  assert.deepEqual(validateContent('posts', { title: 'New title' }, true), { title: 'New title' });
  assert.throws(() => validateContent('posts', {}, true));
  assert.throws(() => validateContent('posts', { title: ' ' }, true));
});
test('rejects malformed, oversized and invalid-date content', () => {
  for (const value of [null, [], 'text']) assert.throws(() => validateContent('posts', value));
  assert.throws(() => validateContent('posts', { content: [123] }, true));
  assert.throws(() => validateContent('posts', { content: Array(501).fill('x') }, true));
  assert.throws(() => validateContent('posts', { title: 'x'.repeat(201) }, true));
  assert.throws(() => validateContent('posts', { date: 'not a date' }, true));
});
test('enforces same-origin browser writes', () => {
  const request = origin => new Request('https://shan.test/api/posts', { headers: { origin } });
  assert.doesNotThrow(() => assertSameOrigin(request('https://shan.test')));
  assert.throws(() => assertSameOrigin(request('https://evil.test')));
  assert.throws(() => assertSameOrigin(new Request('https://shan.test/api/posts', { headers: { 'sec-fetch-site': 'cross-site' } })));
});
