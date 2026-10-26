/* global localStorage, sessionStorage, document, innerWidth, window, console */
import { chromium } from 'file:///C:/Users/iamju/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--disable-gpu', '--no-first-run'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.goto('http://127.0.0.1:5173/projects', { waitUntil: 'networkidle' });
await page.evaluate(() => { const key = 'frevo_marketplace_data_v2'; const state = JSON.parse(localStorage.getItem(key)); state.activeUser = { id: 'minh-anh', name: 'Minh Anh', email: 'minhanh@example.test', role: 'freelancer', actingIdentity: { type: 'individual' }, verified: true }; localStorage.setItem(key, JSON.stringify(state)); });
await page.goto('http://127.0.0.1:5173/settings', { waitUntil: 'networkidle' });
await page.screenshot({ path: 'design/settings-live-desktop.png', fullPage: true });
const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
const sections = await page.locator('main section[id]').count();
const expectedOrder = ['account-info', 'account-security', 'account-privacy', 'account-notifications'];
const actualOrder = await page.locator('main section[id]').evaluateAll(items => items.map(item => item.id));
const orderWorks = JSON.stringify(actualOrder) === JSON.stringify(expectedOrder);
const tracked = [];
const positions = [];
for (const id of expectedOrder) {
  await page.locator(`#${id}`).evaluate(section => section.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForTimeout(150);
  tracked.push(await page.locator('nav[aria-label="Các mục cài đặt"] a[aria-current="location"]').getAttribute('href'));
  positions.push(await page.evaluate(() => ({ scrollY: window.scrollY, privacy: document.getElementById('account-privacy').getBoundingClientRect().top, notifications: document.getElementById('account-notifications').getBoundingClientRect().top })));
}
const scrollTrackingWorks = tracked.every((href, index) => href === `#${expectedOrder[index]}`);
const reverseTracked = [];
for (const id of [...expectedOrder].reverse()) {
  await page.locator(`#${id}`).evaluate(section => section.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForTimeout(150);
  reverseTracked.push(await page.locator('nav[aria-label="Các mục cài đặt"] a[aria-current="location"]').getAttribute('href'));
}
const reverseTrackingWorks = reverseTracked.every((href, index) => href === `#${[...expectedOrder].reverse()[index]}`);
const clicked = [];
for (const id of expectedOrder) {
  await page.locator(`nav[aria-label="Các mục cài đặt"] a[href="#${id}"]`).click();
  await page.waitForTimeout(150);
  clicked.push(await page.locator('nav[aria-label="Các mục cài đặt"] a[aria-current="location"]').getAttribute('href'));
}
const clickTrackingWorks = clicked.every((href, index) => href === `#${expectedOrder[index]}`);
await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
await page.waitForTimeout(150);
const bottomTracksNotifications = await page.locator('nav[aria-label="Các mục cài đặt"] a[aria-current="location"]').getAttribute('href') === '#account-notifications';
await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: 'networkidle' });
await page.evaluate(() => { window.scrollTo(0, 0); document.activeElement?.blur?.(); });
await page.screenshot({ path: 'design/settings-live-mobile.png', fullPage: true });
const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
await page.waitForTimeout(150);
const mobileBottomTracksNotifications = await page.locator('nav[aria-label="Các mục cài đặt"] a[aria-current="location"]').getAttribute('href') === '#account-notifications';
await page.getByRole('textbox', { name: 'Mật khẩu hiện tại' }).fill('old-pass-123');
await page.getByRole('textbox', { name: 'Mật khẩu mới', exact: true }).fill('new-pass-456');
await page.getByRole('textbox', { name: 'Xác nhận mật khẩu mới' }).fill('new-pass-456');
await page.getByRole('button', { name: 'Kiểm tra thay đổi (demo)' }).click();
const passwordPopupWorks = await page.getByText('Thông tin hợp lệ. Mật khẩu đăng nhập chưa thay đổi trong bản demo.').isVisible();
await page.getByRole('textbox', { name: 'Họ và tên', exact: true }).fill('Minh Anh Kiểm tra');
await page.getByRole('textbox', { name: 'Địa chỉ liên hệ' }).fill('Đà Nẵng');
await page.getByRole('button', { name: 'Lưu thay đổi cài đặt' }).click();
const saveWorks = await page.getByText('Đã cập nhật thông tin tài khoản và hồ sơ thành công.').isVisible();
await page.reload({ waitUntil: 'networkidle' });
const fieldsPersist = await page.getByRole('textbox', { name: 'Họ và tên', exact: true }).inputValue() === 'Minh Anh Kiểm tra' && await page.getByRole('textbox', { name: 'Địa chỉ liên hệ' }).inputValue() === 'Đà Nẵng';
const profileSynced = await page.evaluate(() => { const profile = JSON.parse(sessionStorage.getItem('frevo-profile-presentation-minh-anh') ?? 'null'); return profile?.name === 'Minh Anh Kiểm tra' && profile?.location === 'Đà Nẵng'; });
const singleNameAndAddress = await page.getByRole('textbox', { name: 'Tên công khai' }).count() === 0 && await page.getByRole('textbox', { name: 'Địa điểm hiển thị' }).count() === 0;
console.log(JSON.stringify({ desktopOverflow, mobileOverflow, sections, orderWorks, scrollTrackingWorks, reverseTrackingWorks, clickTrackingWorks, bottomTracksNotifications, mobileBottomTracksNotifications, passwordPopupWorks, tracked, reverseTracked, clicked, saveWorks, fieldsPersist, profileSynced, singleNameAndAddress, errors }));
await browser.close();
