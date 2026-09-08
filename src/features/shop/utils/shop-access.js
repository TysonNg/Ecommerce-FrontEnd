'use strict';

const getShopAccess = (shop) => ({
  route: shop?.status === 'active' ? '/user/shop/product' : '/user/shop/register',
  canManage: shop?.status === 'active',
});

module.exports = { getShopAccess };
