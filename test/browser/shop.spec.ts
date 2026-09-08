import { test, expect, Page } from '@playwright/test';

async function sellerPage(page: Page, status: 'active' | 'pending' | 'rejected' | null, loggedIn = true) {
  const errors: string[] = [];
  const sellerRequests: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydration|didn't match|Minified React error #418/i.test(message.text())) errors.push(message.text());
  });
  if (loggedIn) await page.context().addCookies(['_id', 'accessToken', 'refreshToken'].map((name) => ({ name, value: 'seller-test', url: 'http://127.0.0.1:3100' })));
  await page.route('**/v1/api/**', (route) => {
    const path = new URL(route.request().url()).pathname.split('/v1/api')[1];
    if (path === '/shop/me') return route.fulfill({ json: { metadata: status ? { _id: 'shop', name: 'Test shop', status, rejectionReason: 'Missing business details.' } : null } });
    if (path === '/product/drafts/all' || path === '/product/published/all') {
      sellerRequests.push(path);
      if (status !== 'active') return route.fulfill({ status: 403, json: { message: 'Your shop is not active' } });
      return route.fulfill({ json: { metadata: [{ _id: 'product', product_name: 'Test seller product', product_thumb: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', product_type: 'electronics', product_quantity: 3, product_shop: { name: 'Test shop' } }] } });
    }
    if (path.includes('/cart')) return route.fulfill({ json: { metadata: { cart_products: [] } } });
    return route.fulfill({ json: { metadata: [] } });
  });
  return { errors, sellerRequests };
}

test('active seller can load and reload Draft without hydration errors', async ({ page }) => {
  const state = await sellerPage(page, 'active');
  await page.goto('/user/shop/draft');
  await expect(page.getByRole('heading', { name: 'Draft List' })).toBeVisible();
  await expect(page.getByText('Test seller product')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Draft List' })).toBeVisible();
  expect(state.errors).toEqual([]);
});

for (const status of ['pending', 'rejected', null] as const) {
  test(`${status || 'unregistered'} seller cannot load product data from a direct Draft URL`, async ({ page }) => {
    const state = await sellerPage(page, status);
    await page.goto('/user/shop/draft');
    const heading = status === 'pending' ? 'Shop application is pending' : status === 'rejected' ? 'Shop application was not approved' : 'Open your shop';
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    await expect(page).toHaveURL(/\/user\/shop\/register$/);
    expect(state.sellerRequests).toEqual([]);
    expect(state.errors).toEqual([]);
  });
}

test('guest direct Draft URL renders consistently without product requests', async ({ page }) => {
  const state = await sellerPage(page, null, false);
  await page.goto('/user/shop/draft');
  await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
  expect(state.sellerRequests).toEqual([]);
  expect(state.errors).toEqual([]);
});
