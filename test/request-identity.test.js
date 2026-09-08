'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { getRequestIdentityHeaders } = require('../src/app/protected/request-identity');

test('adds the current logged-in user id to an authenticated request', () => {
  assert.deepEqual(getRequestIdentityHeaders('user-1'), { 'x-client-id': 'user-1' });
});

test('does not send an empty client id for a guest request', () => {
  assert.deepEqual(getRequestIdentityHeaders(undefined), {});
});
