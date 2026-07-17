// Smoke tests for the Kiwi & Colibri site. Each test runs twice via
// playwright.config.js: desktop Chromium and an emulated iPhone (WebKit).
const { test, expect } = require('@playwright/test');

function view(page, name) {
  return page.locator(`.view[data-view="${name}"]`);
}

async function gotoHome(page) {
  await page.goto('/');
  await expect(page.locator('body')).toHaveClass(/ready/);
}

async function openMenu(page) {
  await page.locator('#burger').click();
  await expect(page.locator('#menu')).toHaveClass(/open/);
}

// Menu links can sit inside a collapsed submenu; open its group first.
const MENU_GROUP = { looks: 'suit', composer: 'suit', services: 'concierge', delivery: 'concierge' };
async function navFromMenu(page, nav) {
  await openMenu(page);
  const group = MENU_GROUP[nav];
  if (group) await page.locator(`#menu .mitem[data-group="${group}"] .mhead`).click();
  await page.locator(`#menu [data-nav="${nav}"]`).first().click();
  await expect(view(page, nav)).toBeVisible();
  await expect(page.locator('#menu')).not.toHaveClass(/open/);
}

test('home loads clean — no JS errors, no failed requests', async ({ page }) => {
  const errors = [];
  const failed = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
  await gotoHome(page);
  // Walk the whole page so lazy reveals, reels and the image bank all load.
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 700) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});

test('menu drawer navigates views; browser back returns home', async ({ page }) => {
  await gotoHome(page);
  await navFromMenu(page, 'atelier');
  await expect(view(page, 'home')).toBeHidden();
  await page.goBack();
  await expect(view(page, 'home')).toBeVisible();
});

test('looks — grid filters, a look opens with images and piece tiles', async ({ page }) => {
  await gotoHome(page);
  await navFromMenu(page, 'looks');
  const cards = page.locator('#lookGrid a');
  await expect(cards).toHaveCount(6);
  await page.locator('#lookFilter button[data-f="jacket"]').click();
  await expect(cards).toHaveCount(3);
  await page.locator('#lookFilter button[data-f="all"]').click();
  await cards.first().click();
  await expect(view(page, 'look')).toBeVisible();
  await expect(page.locator('#lookVariant')).toContainText('Sandstone');
  await expect(page.locator('#lookStack figure img[src]').first()).toBeVisible();
  await expect(page.locator('#lookTiles .cell')).toHaveCount(3);
});

test('look — add to bag asks for a size, bag badge updates', async ({ page }) => {
  await gotoHome(page);
  await navFromMenu(page, 'looks');
  await page.locator('#lookGrid a').first().click();
  await page.locator('#lookTiles .quick-add').first().click();
  await expect(page.locator('#quickSize')).toHaveClass(/open/);
  await page.locator('#quickSizeOptions [data-size="38"]').click();
  await page.locator('#quickSizeConfirm').click();
  await expect(page.locator('#bagN')).toHaveText('1');
});

test('composer — add to bag, then checkout confirms the order', async ({ page }) => {
  await gotoHome(page);
  await navFromMenu(page, 'composer');
  await page.locator('#compTiles .cell').first().locator('.quick-add').click();
  await expect(page.locator('#quickSize')).toHaveClass(/open/);
  await page.locator('#quickSizeOptions [data-size="38"]').click();
  await page.locator('#quickSizeConfirm').click();
  await expect(page.locator('#bagN')).toHaveText('1');
  await page.locator('#bagLink').click();
  await expect(page.locator('#bag')).toHaveClass(/open/);
  await expect(page.locator('#bagItems .wlitem')).toHaveCount(1);
  await expect(page.locator('#bagItems .bagtot')).toContainText('4,800');
  // First confirm asks where to deliver; details are saved once, then the order confirms.
  await page.locator('[data-bagpay]').first().click();
  await expect(page.locator('#acct')).toHaveClass(/open/);
  await page.locator('#acctEmailForm input[name="email"]').fill('smoke@kiwicolibri.test');
  await page.locator('#acctEmailForm button[type="submit"]').click();
  await page.locator('#acctForm input[name="name"]').fill('Smoke Rider');
  await page.locator('#acctForm input[name="phone"]').fill('+46 70 000 00 00');
  await page.locator('#acctForm textarea[name="address"]').fill('Stallgatan 1, Stockholm');
  await page.locator('#acctForm button.save').click();
  await expect(page.locator('#bag')).toHaveClass(/open/);
  await page.locator('[data-bagpay]').first().click();
  await expect(page.locator('#bagConfirmation')).toContainText('Smoke Rider');
  await expect(page.locator('#bagN')).toBeHidden();
});

test('tiles browse photos in place; caption opens the piece page; order uses chosen size', async ({ page }) => {
  await gotoHome(page);
  await navFromMenu(page, 'composer');
  // photo arrows sit on the tile from the start — no click needed
  const firstTile = page.locator('#compTiles .cell').first();
  await expect(firstTile.locator('.tnav.next')).toBeVisible();
  await firstTile.locator('.tnav.next').click(); // steps to the back shot in place
  await expect(view(page, 'composer')).toBeVisible();
  await firstTile.locator('.cap2').click();
  await expect(view(page, 'piece')).toBeVisible();
  await expect(page.locator('#pieceName')).toHaveText('Tailcoat');
  await page.locator('#pieceOrder').click();
  await expect(page.locator('#quickSize')).toHaveClass(/open/);
  await page.locator('#quickSizeOptions [data-size="40"]').click();
  await page.locator('#quickSizeConfirm').click();
  await expect(page.locator('.bagtoast')).toHaveClass(/show/);
  await expect(page.locator('#bagN')).toHaveText('1');
  await page.locator('#bagLink').click();
  await expect(page.locator('#bagItems .nm').first()).toContainText('40');
});

test('wishlist — heart saves a piece, it appears in the wishlist panel', async ({ page }) => {
  await gotoHome(page);
  await navFromMenu(page, 'composer');
  await page.locator('#compTiles .cell').first().locator('.wlbtn').click();
  await page.locator('#wlLink').click();
  await expect(page.locator('#wlItems .wlitem')).toHaveCount(1);
  await expect(page.locator('#wlItems .nm')).toContainText('Tailcoat');
});

test('size guide overlay opens from the menu and closes', async ({ page }) => {
  await gotoHome(page);
  await openMenu(page);
  await page.locator('#menu .mitem[data-group="concierge"] .mhead').click();
  await page.locator('#menu [data-open-sizeg]').click();
  await expect(page.locator('#sizeg')).toHaveClass(/open/);
  await page.locator('#sizegX').click();
  await expect(page.locator('#sizeg')).not.toHaveClass(/open/);
});
