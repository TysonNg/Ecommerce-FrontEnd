'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { getShopAccess } = require('../src/features/shop/utils/shop-access');

test('keeps a pending shop out of seller management', () => {
  assert.deepEqual(getShopAccess({ status: 'pending' }), {
    route: '/user/shop/register',
    canManage: false,
  });
});

test('allows an active shop into seller management', () => {
  assert.deepEqual(getShopAccess({ status: 'active' }), {
    route: '/user/shop/product',
    canManage: true,
  });
});

test('sends a user without a shop to registration', () => {
  assert.deepEqual(getShopAccess(null), {
    route: '/user/shop/register',
    canManage: false,
  });
});
