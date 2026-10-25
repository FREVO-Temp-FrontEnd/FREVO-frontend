import { URL } from "node:url";
import process from "node:process";
import console from "node:console";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { writeFile, unlink } from "node:fs/promises";
const outfile = new URL("./.profile-check.cjs", import.meta.url);
try {
  await build({
    stdin: { contents: `
      import React from 'react';
      import {renderToStaticMarkup} from 'react-dom/server';
      import {MemoryRouter} from 'react-router';
      import {FreelancerProfile} from './src/features/profile/components/FreelancerProfile';
      import {initialWorks} from './src/lib/storage/seeds/portfolioSeed';
      export function render(owner, ids) {
        global.sessionStorage = {getItem: () => JSON.stringify({name:'Minh Anh',role:'Designer',location:'TP.HCM',availability:'Sẵn sàng',about:'Giới thiệu',skills:['Figma'],featuredIds:ids}),setItem:()=>{}};
        const works=initialWorks.map(w=>w.id==='fintech'?{...w,visibility:'private'}:w);
        const talent={id:'minh-anh',name:'Minh Anh',role:'Designer',location:'TP.HCM',availability:'Sẵn sàng',about:'Giới thiệu',skills:['Figma'],initials:'MA'};
        return renderToStaticMarkup(<MemoryRouter><FreelancerProfile talent={talent} works={works} owner={owner} /></MemoryRouter>);
      }`, resolveDir: process.cwd(), loader: "tsx" },
    bundle: true, platform: "node", format: "cjs", packages: "external", tsconfig: "tsconfig.app.json", write: false,
  }).then(result => writeFile(outfile, result.outputFiles[0].contents));
  const { createRequire } = await import("node:module");
  const { render } = createRequire(import.meta.url)(outfile.pathname.replace(/^\/(\w:)/, "$1"));
  const html = render(false, ['herbe','fintech','moc','saigon']);
  assert.ok(html.includes('Portfolio nổi bật'));
  assert.equal((html.match(/class="portfolio-card /g)||[]).length, 2);
  assert.ok(!html.includes('FinTech App'));
  assert.ok(html.indexOf('L’Herbe') < html.indexOf('Mộc Coffee'));
  assert.ok(!html.includes('Chọn tác phẩm nổi bật'));
  assert.ok(!html.includes('Chỉnh sửa hồ sơ'));
  assert.ok(!html.includes('CV của tôi'));
  const owner = render(true, ['moc','herbe','saigon']);
  assert.equal((owner.match(/class="portfolio-card /g)||[]).length, 3);
  assert.ok(!owner.includes('Chọn tác phẩm nổi bật'));
  assert.ok(!owner.includes('Chỉnh sửa hồ sơ'));
  assert.ok(!owner.includes('Chỉnh sửa giới thiệu'));
  assert.ok(!owner.includes('Chỉnh sửa kỹ năng'));
  assert.ok(owner.includes('Xem thêm'));
  console.log('Profile checks passed: visibility, owner actions, selected order, three featured works, no public CV.');
} finally { await unlink(outfile).catch(()=>{}); }
