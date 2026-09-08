import { test, expect, Page } from '@playwright/test';

const shopId = '507f1f77bcf86cd799439011';
const fixture = {
  _id: shopId, name: 'Northline Electronics', slug: 'northline-electronics', description: 'Electronics and everyday essentials.', status: 'pending',
  createdAt: '2026-09-08T09:00:00Z', ownerId: { _id: 'owner', name: 'Alex Nguyen', email: 'alex@example.test' }, reviewedBy: null,
};
async function session(page: Page) {
  await page.context().addCookies([
    { name: '_id', value: 'test-admin', url: 'http://127.0.0.1:3100' },
    { name: 'accessToken', value: 'browser-test-token', url: 'http://127.0.0.1:3100' },
  ]);
}
async function mockApi(page: Page, options: { denied?: boolean; empty?: boolean; conflict?: boolean; outage?: boolean } = {}) {
  let status = 'pending'; let rejectionReason = '';
  let lastSearch = ''; let writes = 0;
  await page.route('**/v1/api/**', async (route) => {
    const url = new URL(route.request().url()); const path = url.pathname.split('/v1/api')[1];
    if (path === '/user/login') return route.fulfill({ json: { metadata: { user: { _id: 'admin', name: 'Administrator' }, tokens: { accessToken: 'test-token', refreshToken: 'test-refresh' } } } });
    if (path === '/user/logout') return route.fulfill({ json: { metadata: {} } });
    if (path === '/admin/me') return route.fulfill({ status: options.denied ? 403 : 200, json: options.denied ? { message: 'Forbidden' } : { metadata: { _id: 'admin', name: 'Administrator', email: 'admin@example.test' } } });
    if (options.outage) return route.abort('failed');
    if (path === '/admin/shops/summary') return route.fulfill({ json: { metadata: { total: 28, pending: 5, active: 21, rejected: 2 } } });
    if (path === '/admin/shops') {
      lastSearch = url.search;
      return route.fulfill({ json: { metadata: { items: options.empty ? [] : [fixture], total: options.empty ? 0 : 28, page: Number(url.searchParams.get('page') || 1), limit: 20, totalPages: options.empty ? 0 : 2 } } });
    }
    if (route.request().method() === 'PATCH') {
      writes++;
      status = path.endsWith('/approve') ? 'active' : 'rejected';
      rejectionReason = route.request().postDataJSON()?.reason || '';
      return route.fulfill({ status: options.conflict ? 409 : 200, json: options.conflict ? { message: 'Only pending shops can be reviewed' } : { metadata: {} } });
    }
    if (path === `/admin/shops/${shopId}`) return route.fulfill({ json: { metadata: { ...fixture, status, rejectionReason, reviewedBy: status === 'pending' ? null : { name: 'Administrator', email: 'admin@example.test' }, reviewedAt: status === 'pending' ? null : '2026-09-08T10:00:00Z' } } });
    if (path === '/shop/me') return route.fulfill({ json: { metadata: { ...fixture, status: 'rejected', rejectionReason: 'Please provide complete business details.' } } });
    if (path.includes('/cart')) return route.fulfill({ json: { metadata: { cart_products: [] } } });
    return route.fulfill({ json: { metadata: [] } });
  });
  return { search: () => lastSearch, writes: () => writes };
}

test('login preserves requested URL and hides storefront navigation', async ({ page }) => {
  await mockApi(page); await page.goto(`/admin/shops/${shopId}`);
  await expect(page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible();
  await page.getByLabel('Email address').fill('admin@example.test'); await page.getByLabel('Password', { exact: true }).fill('browser-test-only');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Shop application', exact: true })).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`/admin/shops/${shopId}$`));
  await expect(page.getByRole('link', { name: 'All products', exact: true })).toHaveCount(0);
});
test('ordinary account sees Access denied without loading admin data', async ({ page }) => {
  await session(page); const calls: string[] = []; page.on('request', (request) => calls.push(request.url()));
  await mockApi(page, { denied: true }); await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Access denied' })).toBeVisible();
  expect(calls.some((url) => url.includes('/v1/api/admin/shops'))).toBe(false);
});
test('overview displays API data and flat styling on desktop and mobile', async ({ page }, testInfo) => {
  await session(page); await mockApi(page); await page.setViewportSize({ width: 1440, height: 960 }); await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Shop approvals' })).toBeVisible();
  await expect(page.locator('.admin-stat').first()).toContainText('28');
  const effects = await page.locator('.admin-ui').evaluate((root) => [...root.querySelectorAll('*')].filter((element) => {
    const style = getComputedStyle(element); return style.boxShadow !== 'none' || style.backgroundImage.includes('gradient') || style.backdropFilter !== 'none';
  }).length);
  expect(effects).toBe(0);
  await expect(page.locator('.admin-sidebar')).toHaveCSS('width', '224px');
  await expect(page.locator('.admin-sidebar')).toHaveCSS('background-color', 'rgb(43, 50, 62)');
  await expect(page.locator('.admin-topbar')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('.admin-panel')).toHaveCSS('border-radius', '0px');
  expect(await page.locator('.admin-ui').evaluate((root) => [...root.querySelectorAll('button, input, select, textarea, .admin-badge')].every((element) => {
    const style = getComputedStyle(element);
    return [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomLeftRadius, style.borderBottomRightRadius].every((radius) => parseFloat(radius) <= 4);
  }))).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('overview-desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('button', { name: 'Toggle navigation' })).toBeVisible();
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await expect(page.getByRole('navigation', { name: 'Admin navigation' })).toBeVisible();
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('overview-mobile.png'), fullPage: true });
});
test('filters and pagination persist in URL and back navigation', async ({ page }) => {
  await session(page); const api = await mockApi(page); await page.goto('/admin/shops');
  await expect(page.getByRole('link', { name: 'View Northline Electronics' })).toBeVisible();
  await page.getByLabel('Search shops').fill('Northline'); await page.getByLabel('Status', { exact: true }).selectOption('all'); await page.getByRole('button', { name: 'Apply filters' }).click();
  await expect(page).toHaveURL(/status=all&page=1&q=Northline/);
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page).toHaveURL(/page=2/); await expect.poll(api.search).toContain('page=2');
  await page.goBack(); await expect(page).toHaveURL(/page=1/); await expect(page.getByLabel('Search shops')).toHaveValue('Northline');
});
test('approval dialog traps focus, supports Escape and requires confirmation', async ({ page }) => {
  await session(page); const api = await mockApi(page); await page.goto(`/admin/shops/${shopId}`);
  await page.getByRole('button', { name: 'Approve shop', exact: true }).click();
  const dialog = page.getByRole('dialog'); await expect(dialog).toBeVisible(); await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab'); await expect(page.getByRole('button', { name: 'Confirm approval' })).toBeFocused();
  await page.keyboard.press('Escape'); await expect(dialog).not.toBeVisible(); expect(api.writes()).toBe(0);
  await page.getByRole('button', { name: 'Approve shop', exact: true }).click(); await page.getByRole('button', { name: 'Confirm approval' }).click();
  await expect(page.locator('.admin-notice')).toContainText('Shop approved'); await expect(page.locator('.admin-badge').first()).toHaveText('active'); expect(api.writes()).toBe(1);
});
test('reject validates reason and shows saved review', async ({ page }, testInfo) => {
  await session(page); const api = await mockApi(page); await page.goto(`/admin/shops/${shopId}`);
  await page.getByRole('button', { name: 'Reject', exact: true }).click(); await page.getByLabel('Reason for rejection').fill('   '); await page.getByRole('button', { name: 'Confirm rejection' }).click();
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('Enter a reason'); expect(api.writes()).toBe(0);
  await page.getByLabel('Reason for rejection').fill('Please provide complete business details.');
  await page.screenshot({ path: testInfo.outputPath('rejection-dialog.png'), fullPage: true });
  await page.getByRole('button', { name: 'Confirm rejection' }).click(); await expect(page.locator('.admin-review-reason')).toContainText('Please provide complete business details.');
  await page.screenshot({ path: testInfo.outputPath('detail-desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('detail-mobile.png'), fullPage: true });
});
test('conflict reloads the latest decision', async ({ page }) => {
  await session(page); await mockApi(page, { conflict: true }); await page.goto(`/admin/shops/${shopId}`);
  await page.getByRole('button', { name: 'Approve shop', exact: true }).click(); await page.getByRole('button', { name: 'Confirm approval' }).click();
  await expect(page.locator('.admin-notice')).toContainText('already been reviewed'); await expect(page.locator('.admin-badge').first()).toHaveText('active');
  await expect(page.getByRole('heading', { name: 'Shop application', exact: true })).toBeFocused();
});
test('empty and failed requests have usable recovery states', async ({ page }) => {
  await session(page); const options = { empty: true, outage: false }; await mockApi(page, options); await page.goto('/admin/shops');
  await expect(page.getByRole('heading', { name: 'No shops found' })).toBeVisible();
  options.outage = true; await page.reload(); await expect(page.getByRole('main').getByRole('alert')).toContainText('Unable to connect');
  options.outage = false; await page.getByRole('button', { name: 'Retry' }).click(); await expect(page.getByRole('heading', { name: 'No shops found' })).toBeVisible();
});
test('storefront frame still renders and rejected owner can read reason', async ({ page }) => {
  await session(page); await mockApi(page); await page.goto('/user/shop/register');
  await expect(page.getByRole('heading', { name: 'Shop application was not approved' })).toBeVisible();
  await expect(page.getByText('Please provide complete business details.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'All products', exact: false, includeHidden: true }).first()).toBeAttached();
});

test('rejection counts trimmed characters and preserves a 500-character reason', async ({ page }) => {
  await session(page); await mockApi(page); await page.goto(`/admin/shops/${shopId}`);
  await page.getByRole('button', { name: 'Reject', exact: true }).click();
  const reason = 'x'.repeat(500);
  await page.getByLabel('Reason for rejection').fill(`  ${reason}  `);
  await expect(page.getByLabel('Reason for rejection')).toHaveValue(`  ${reason}  `);
  await expect(page.getByRole('dialog')).toContainText('500/500 characters');
  await page.getByRole('button', { name: 'Confirm rejection' }).click();
  await expect(page.locator('.admin-review-reason')).toHaveText(`Reason${reason}`);
});

test('rejection rejects more than 500 trimmed characters without a request', async ({ page }) => {
  await session(page); const api = await mockApi(page); await page.goto(`/admin/shops/${shopId}`);
  await page.getByRole('button', { name: 'Reject', exact: true }).click();
  await page.getByLabel('Reason for rejection').fill('x'.repeat(501));
  await page.getByRole('button', { name: 'Confirm rejection' }).click();
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('Enter a reason');
  expect(api.writes()).toBe(0);
});

test('pending review disables controls, blocks Escape and recovers from network failure', async ({ page }) => {
  await session(page); await mockApi(page);
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  await page.route(`**/v1/api/admin/shops/${shopId}/reject`, async (route) => { await held; await route.abort('failed'); });
  await page.goto(`/admin/shops/${shopId}`);
  await page.getByRole('button', { name: 'Reject', exact: true }).click();
  await page.getByLabel('Reason for rejection').fill('Missing details');
  await page.getByRole('button', { name: 'Confirm rejection' }).click();
  await expect(page.getByRole('button', { name: 'Saving' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeDisabled();
  await expect(page.getByLabel('Reason for rejection')).toBeDisabled();
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toBeVisible();
  release();
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('Unable to connect');
  await expect(page.getByLabel('Reason for rejection')).toHaveValue('Missing details');
  await page.unroute(`**/v1/api/admin/shops/${shopId}/reject`);
  await page.getByRole('button', { name: 'Confirm rejection' }).click();
  await expect(page.locator('.admin-review-reason')).toContainText('Missing details');
});

test('access check loading and network Retry do not expose content early', async ({ page }) => {
  await session(page); await mockApi(page);
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  await page.route('**/v1/api/admin/me', async (route) => { await held; await route.abort('failed'); });
  await page.goto('/admin/shops?status=rejected&page=2');
  await expect(page.getByRole('status')).toContainText('Checking your account');
  await expect(page.getByRole('navigation', { name: 'Admin navigation' })).toHaveCount(0);
  release();
  await expect(page.getByRole('heading', { name: 'Unable to load admin' })).toBeVisible();
  await page.unroute('**/v1/api/admin/me');
  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(page.getByRole('heading', { name: 'Shops', exact: true })).toBeVisible();
  await expect(page).toHaveURL(/status=rejected&page=2/);
});

test('mobile table scrolls by keyboard and storefront navigation survives admin links', async ({ page }) => {
  await session(page); await mockApi(page); await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/admin/shops');
  const table = page.getByRole('region', { name: 'Shop applications table' });
  await expect(table).toBeVisible();
  expect(await table.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  await table.focus(); await page.keyboard.press('ArrowRight');
  await expect.poll(() => table.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Toggle navigation' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('navigation', { name: 'Admin navigation' })).toBeVisible();
  await page.getByRole('link', { name: 'Overview', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Toggle navigation' })).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await page.getByRole('link', { name: 'Back to store', exact: true }).click();
  await expect(page.locator('.site')).toBeVisible();
  await expect(page.locator('.admin-ui')).toHaveCount(0);
});

test('expired session returns to login and resumes the filtered URL', async ({ page }) => {
  await session(page); await mockApi(page); await page.goto('/admin/shops?status=all&page=2');
  await expect(page.getByRole('link', { name: 'View Northline Electronics' })).toBeVisible();
  await page.route('**/v1/api/admin/shops?**', (route) => route.fulfill({ status: 401, json: { message: 'Session expired' } }));
  await page.getByRole('button', { name: 'Apply filters' }).click();
  await expect(page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Admin navigation' })).toHaveCount(0);
  await page.unroute('**/v1/api/admin/shops?**');
  await page.getByLabel('Email address').fill('admin@example.test');
  await page.getByLabel('Password', { exact: true }).fill('browser-test-only');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Shops', exact: true })).toBeVisible();
  await expect(page).toHaveURL(/status=all&page=1/);
});

test('role revoked during review closes the dialog and shows Access denied', async ({ page }) => {
  await session(page); await mockApi(page); await page.goto(`/admin/shops/${shopId}`);
  await page.route(`**/v1/api/admin/shops/${shopId}/approve`, (route) => route.fulfill({ status: 403, json: { message: 'Permission denied' } }));
  await page.getByRole('button', { name: 'Approve shop', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm approval' }).click();
  await expect(page.getByRole('heading', { name: 'Access denied' })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Admin navigation' })).toHaveCount(0);
});

for (const status of [400, 403]) {
  test(`invalid refresh (${status}) shows login instead of a permission or retry dead end`, async ({ page }) => {
    await session(page); await mockApi(page);
    await page.context().addCookies([{ name: 'refreshToken', value: 'invalid-refresh', url: 'http://127.0.0.1:3100' }]);
    await page.route('**/v1/api/admin/me', (route) => route.fulfill({ status: 401, json: { message: 'ACCESS_TOKEN_EXPIRED' } }));
    let refreshes = 0;
    await page.route('**/v1/api/user/handleRefreshToken', (route) => {
      refreshes++;
      return route.fulfill({ status, json: { message: 'Invalid refresh token' } });
    });
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible();
    await expect(page.getByRole('main').getByRole('alert')).toContainText('Your session has expired');
    expect(refreshes).toBe(1);
  });
}

test('each overview statistic opens the matching shop filter', async ({ page }) => {
  await session(page); await mockApi(page);
  for (const [key, status] of [['total', 'all'], ['pending', 'pending'], ['active', 'active'], ['rejected', 'rejected']]) {
    await page.goto('/admin');
    await page.locator(`.admin-stat.${key}`).click();
    await expect(page).toHaveURL(new RegExp(`status=${status}$`));
    await expect(page.getByLabel('Status', { exact: true })).toHaveValue(status);
  }
});

test('missing admin service is not reported as a missing shop', async ({ page }) => {
  await session(page); await mockApi(page);
  await page.route('**/v1/api/admin/me', (route) => route.fulfill({ status: 404, json: { message: 'Not Found' } }));
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Unable to load admin' })).toBeVisible();
  await expect(page.getByRole('main').getByRole('alert')).toHaveText('The admin service is unavailable. Please try again later.');
  await expect(page.getByText('This shop could not be found.')).toHaveCount(0);
});

test('missing shop detail still reports a missing shop', async ({ page }) => {
  await session(page); await mockApi(page);
  await page.route(`**/v1/api/admin/shops/${shopId}`, (route) => route.fulfill({ status: 404, json: { message: 'Shop not found' } }));
  await page.goto(`/admin/shops/${shopId}`);
  await expect(page.getByRole('main').getByRole('alert')).toHaveText('This shop could not be found.');
});
