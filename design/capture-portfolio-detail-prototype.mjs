/* global document, innerWidth, console */
import { chromium } from 'file:///C:/Users/iamju/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--disable-gpu', '--no-first-run'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.goto('http://127.0.0.1:5173/design/portfolio-detail-prototype.html', { waitUntil: 'networkidle' });
await page.locator('.thumb').first().waitFor();
await page.screenshot({ path: 'design/portfolio-detail-prototype-desktop.png', fullPage: true });
const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
await page.getByRole('button', { name: 'Xem ảnh dự án 2' }).click();
const galleryWorks = await page.getByRole('button', { name: 'Xem ảnh dự án 2' }).getAttribute('aria-pressed') === 'true';
await page.getByRole('button', { name: 'Xem ảnh lớn' }).click();
const lightboxWorks = await page.getByRole('dialog').isVisible();
await page.getByRole('button', { name: 'Đóng' }).click();
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: 'design/portfolio-detail-prototype-mobile.png', fullPage: true });
const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
await writeFile('design/portfolio-detail-prototype-checks.json', JSON.stringify({ desktopOverflow, mobileOverflow, galleryWorks, lightboxWorks, errors }, null, 2));
console.log(JSON.stringify({ desktopOverflow, mobileOverflow, galleryWorks, lightboxWorks, errors }));
await browser.close();
