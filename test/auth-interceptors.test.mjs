import { test } from 'node:test';
import assert from 'node:assert/strict';
import axios from 'axios';
import { installAuthInterceptors } from '../src/app/protected/auth-interceptors.js';

function client(adapter) {
  const values = { _id: 'user', accessToken: 'old', refreshToken: 'refresh' };
  const cookies = { get: (key) => values[key], set: (key, value) => { values[key] = value; }, remove: (key) => { delete values[key]; } };
  const api = axios.create({ adapter }); installAuthInterceptors(api, cookies);
  return { api, values };
}
function failure(config, status, message) {
  return new axios.AxiosError(message, undefined, config, undefined, status ? { status, data: { message } } : undefined);
}
test('network and permission errors reject without refresh', async () => {
  for (const status of [undefined, 403, 500]) {
    let calls = 0;
    const { api } = client(async (config) => { calls++; throw failure(config, status, 'Error'); });
    await assert.rejects(api.get('/admin/me')); assert.equal(calls, 1);
  }
});
test('concurrent expired requests share one refresh and use new headers', async () => {
  let refreshes = 0;
  const { api } = client(async (config) => {
    if (config.url.includes('handleRefreshToken')) {
      refreshes++; await new Promise((resolve) => setTimeout(resolve, 10));
      return { data: { metadata: { tokens: { accessToken: 'new', refreshToken: 'new-refresh' } } } };
    }
    if (config.headers.get('authorization') === 'old') throw failure(config, 401, 'ACCESS_TOKEN_EXPIRED');
    assert.equal(config.headers.get('authorization'), 'new');
    return { data: 'ok' };
  });
  const results = await Promise.all([api.get('/admin/me'), api.get('/admin/shops')]);
  assert.equal(refreshes, 1); assert.equal(results[0].data, 'ok');
});
test('failed refresh rejects without recursive refresh and clears invalid tokens', async () => {
  let calls = 0;
  const { api, values } = client(async (config) => { calls++; throw failure(config, 401, 'ACCESS_TOKEN_EXPIRED'); });
  await assert.rejects(api.get('/admin/me')); assert.equal(calls, 2); assert.equal(values.accessToken, undefined);
});
test('retries at most once even if the replacement token is expired', async () => {
  let calls = 0;
  const { api } = client(async (config) => {
    calls++;
    if (config.url.includes('handleRefreshToken')) return { data: { metadata: { tokens: { accessToken: 'new', refreshToken: 'new-refresh' } } } };
    throw failure(config, 401, 'ACCESS_TOKEN_EXPIRED');
  });
  await assert.rejects(api.get('/admin/me')); assert.equal(calls, 3);
});
