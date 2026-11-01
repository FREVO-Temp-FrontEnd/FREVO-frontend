import { URL } from 'node:url';
import { Buffer } from 'node:buffer';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';
const source = readFileSync(new URL('./workProgress.ts', import.meta.url), 'utf8');
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { workProgress } = await import('data:text/javascript;base64,' + Buffer.from(output).toString('base64'));
test('submitted milestones await review and do not count as completed', () => {
  const result = workProgress({ milestones: [{ status: 'completed' }, { status: 'submitted' }, { status: 'in_progress' }] });
  assert.equal(result.completed, 1);
  assert.equal(result.percent, 33);
  assert.equal(result.next.status, 'submitted');
});
test('revision requests only require action until resubmitted', () => {
  assert.equal(workProgress({ milestones: [{ status: 'in_progress', revisionHistory: [{ reason: 'Revise' }] }] }).revision, true);
  assert.equal(Boolean(workProgress({ milestones: [{ status: 'submitted', revisionHistory: [{ reason: 'Revise' }] }] }).revision), false);
});
test('missing milestones have a stable zero progress', () => {
  assert.deepEqual(workProgress(), { completed: 0, total: 0, percent: 0, next: undefined, revision: undefined });
});
