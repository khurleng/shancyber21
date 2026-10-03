import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
let checks = 0;
async function check(path, status, init) {
  const response = await fetch(base + path, init);
  assert.equal(response.status, status, `${init?.method || 'GET'} ${path}`);
  checks++;
  return response;
}
for (const path of ['/', '/product', '/blog', '/admin']) await check(path, 200);
for (const resource of ['posts', 'products']) {
  const response = await check(`/api/${resource}`, 200);
  assert.ok(Array.isArray(await response.json()));
  for (const [method, suffix] of [['POST', ''], ['PUT', '/smoke-nonexistent'], ['DELETE', '/smoke-nonexistent']]) {
    await check(`/api/${resource}${suffix}`, 401, {
      method, headers: { 'Content-Type': 'application/json' }, body: '{}',
    });
  }
  await check(`/api/${resource}/smoke-nonexistent`, 404);
}
await check('/api/admin/session', 401);
await check('/api/admin/password', 401, { method: 'POST', body: '{}' });
await check('/api/admin/login', 403, {
  method: 'POST', headers: { Origin: 'https://other-site.invalid' }, body: '{}',
});
await check('/api/admin/login', 400, { method: 'POST', body: 'not-json' });
const logout = await check('/api/admin/logout', 200, { method: 'POST' });
assert.match(logout.headers.get('set-cookie') || '', /sc-admin-session=.*Max-Age=0/i);
console.log(`${checks} HTTP smoke checks passed. No content was changed.`);
