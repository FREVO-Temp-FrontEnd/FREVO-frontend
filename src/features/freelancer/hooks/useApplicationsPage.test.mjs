import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL, URL } from 'node:url';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const moduleUrl = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
const fixture = moduleUrl('export const useFreelancer = () => ({ myApplications: [{ id: "a", projectId: "p", talentId: "t", status: "new", receivedAt: "2026-11-01" }, { id: "b", projectId: "p", talentId: "t", status: "discussing", receivedAt: "2026-11-01" }], projects: [{ id: "p", title: "Dự án", company: "Studio" }], agreements: [], canManage: () => true });');
let source = ts.transpileModule(readFileSync(new URL('./useApplicationsPage.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
source = source.replace(/from ['"]react['"]/, 'from ' + JSON.stringify(pathToFileURL(require.resolve('react')).href)).replace(/from ['"]@\/lib\/hooks\/useFreelancer['"]/, 'from ' + JSON.stringify(fixture));
const { useApplicationsPage } = await import(moduleUrl(source));
test('applications stay unselected until a card is chosen, and reset when changing filters', () => {
  let step = 0;
  function Probe() {
    const page = useApplicationsPage();
    if (step === 0) {
      assert.equal(page.pageRows.length, 1);
      assert.equal(page.selected, undefined);
      step++;
      page.setSelectedId('a');
    } else if (step === 1) {
      assert.equal(page.selected.candidate.id, 'a');
      step++;
      page.setFilter('discussing');
    } else if (step === 2) {
      assert.equal(page.pageRows[0].candidate.id, 'b');
      assert.equal(page.selected, undefined);
      step++;
      page.setSelectedId('b');
    } else if (step === 3) {
      assert.equal(page.selected.candidate.id, 'b');
      step++;
      page.setSelectedId(null);
    } else assert.equal(page.selected, undefined);
    return null;
  }
  renderToString(createElement(Probe));
  assert.equal(step, 4);
});
