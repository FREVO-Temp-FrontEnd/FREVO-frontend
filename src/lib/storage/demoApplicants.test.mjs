import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { URL } from 'node:url';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

async function load(path) {
  const source = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
  return import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
}
const { demoApplicants, DEMO_APPLICATION_DELAY } = await load('./demoApplicants.ts');
const { briefDuration } = await load('../utils/briefDuration.ts');
const now = new Date(2026, 10, 1, 12).getTime();
const project = { id: 'new-project', title: 'Brand kit', status: 'published', preference: 'both', applicationDeadline: '10/11/2026', demoApplicationsDueAt: now + DEMO_APPLICATION_DELAY };
const state = { candidates: [], talents: [
  { id: 'a', kind: 'Cá nhân' }, { id: 'b', kind: 'Cá nhân' },
  { id: 'team-a', kind: 'Team', teamLeaderId: 'a' }, { id: 'team-b', kind: 'Team', teamLeaderId: 'b' },
] };
test('batch appears only after five seconds with unique IDs and locked review state', () => {
  assert.equal(demoApplicants(project, state, now + 4999).length, 0);
  const result = demoApplicants(project, state, now + 5000);
  assert.equal(result.length, 2);
  assert.equal(new Set(result.map(item => item.id)).size, 2);
  assert.ok(result.every(item => item.status === 'new' && item.unread && !item.chatUnlocked));
});
test('draft, closed, expired and completed batches do not generate applications', () => {
  for (const patch of [{ status: 'draft' }, { status: 'closed' }, { demoApplicationsCompleted: true }, { applicationDeadline: '31/10/2026' }, { demoApplicationsDueAt: undefined }]) {
    assert.deepEqual(demoApplicants({ ...project, ...patch }, state, now + 5000), []);
  }
});
test('resuming a persisted pending batch after its due time generates only missing accounts', () => {
  const result = demoApplicants(project, state, now + 5000);
  const persisted = { ...state, candidates: result };
  assert.deepEqual(demoApplicants(project, persisted, now + 20000), []);
  assert.equal(demoApplicants(project, { ...state, candidates: [result[0]] }, now + 20000).length, 1);
});
test('individual/team preferences preserve one identity per account', () => {
  assert.deepEqual(demoApplicants({ ...project, preference: 'team' }, state, now + 5000).map(item => item.talentId), ['team-a', 'team-b']);
  assert.deepEqual(demoApplicants({ ...project, preference: 'individual' }, state, now + 5000).map(item => item.talentId), ['a', 'b']);
  const candidates = [{ projectId: project.id, talentId: 'a', applicantAccountId: 'a' }];
  assert.deepEqual(demoApplicants({ ...project, preference: 'team' }, { ...state, candidates }, now + 5000).map(item => item.talentId), ['team-b']);
});
test('duration follows the completion date across month and DST boundaries', () => {
  assert.equal(briefDuration('', new Date(2026, 10, 1)), '');
  assert.equal(briefDuration('2026-11-29', new Date(2026, 10, 1)), '4 tuần');
  assert.equal(briefDuration('2026-12-02', new Date(2026, 10, 1)), '31 ngày');
  assert.equal(briefDuration('2026-03-09', new Date(2026, 2, 7)), '2 ngày');
});

test('automatic applicants leave Minh Anh and represented teams available for invitation demos', () => {
  const withReservedTalent = { ...state, talents: [
    { id: 'minh-anh', kind: 'Cá nhân' },
    { id: 'minh-anh-team', kind: 'Team', teamLeaderId: 'minh-anh' },
    ...state.talents,
  ] };
  for (const preference of ['both', 'individual', 'team']) {
    const result = demoApplicants({ ...project, preference }, withReservedTalent, now + 5000);
    assert.equal(result.length, 2);
    assert.ok(result.every(candidate => candidate.talentId !== 'minh-anh' && candidate.applicantAccountId !== 'minh-anh'));
  }
});
