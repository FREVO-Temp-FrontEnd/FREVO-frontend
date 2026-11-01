import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { URL } from 'node:url';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

const moduleUrl = source => `data:text/javascript;base64,${Buffer.from(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText).toString('base64')}`;
const access = moduleUrl(readFileSync(new URL('./applicationAccess.ts', import.meta.url), 'utf8'));
const source = readFileSync(new URL('./agreementSelection.ts', import.meta.url), 'utf8').replace('"./applicationAccess"', JSON.stringify(access));
const { resolveAgreement } = await import(moduleUrl(source));
const now = Date.parse('2026-10-31T10:00:00Z');
function fixture() {
  return {
    activeUser: { id: 'owner', role: 'freelancer' },
    projects: [{ id: 'project', company: 'Studio', status: 'published' }],
    candidates: [{ id: 'candidate', projectId: 'project', talentId: 'team', applicantAccountId: 'owner', status: 'offer', chatUnlocked: true }, { id: 'other', projectId: 'project', talentId: 'other', status: 'discussing', chatUnlocked: true }],
    talents: [], invitations: [], notifications: [],
    agreements: [{ id: 'proposal', projectId: 'project', talentId: 'team', version: 1, status: 'pending', isEffective: false, expiresAt: new Date(now + 10000).toISOString() }],
  };
}
test('decline returns application to discussion and notifies business', () => {
  const result = resolveAgreement(fixture(), 'proposal', false, now);
  assert.equal(result.candidates[0].status, 'discussing');
  assert.equal(result.agreements[0].status, 'rejected');
  assert.equal(result.projects[0].status, 'published');
  assert.equal(result.notifications[0].recipientCompany, 'Studio');
});
test('declining an amendment keeps the selected provider and effective agreement', () => {
  const state = fixture();
  state.projects[0] = { ...state.projects[0], status: 'ongoing', selectedTalentId: 'team' };
  state.candidates[0].status = 'selected';
  state.agreements[0].version = 2;
  state.agreements.push({ ...state.agreements[0], id: 'effective', version: 1, status: 'confirmed', isEffective: true });
  const result = resolveAgreement(state, 'proposal', false, now);
  assert.equal(result.candidates[0].status, 'selected');
  assert.equal(result.agreements.find(item => item.id === 'effective').isEffective, true);
});
test('accept selects exactly one provider and is idempotent', () => {
  const result = resolveAgreement(fixture(), 'proposal', true, now);
  assert.equal(result.candidates[0].status, 'selected');
  assert.equal(result.candidates[1].status, 'not_selected');
  assert.equal(result.projects[0].selectedTalentId, 'team');
  assert.equal(result.agreements[0].isEffective, true);
  assert.equal(resolveAgreement(result, 'proposal', true, now), result);
});
test('expired, outdated and unauthorized proposals cannot be accepted', () => {
  const expired = fixture(); expired.agreements[0].expiresAt = new Date(now).toISOString();
  assert.throws(() => resolveAgreement(expired, 'proposal', true, now), /hết hạn/);
  const outdated = fixture(); outdated.agreements.push({ ...outdated.agreements[0], id: 'new', version: 2 });
  assert.throws(() => resolveAgreement(outdated, 'proposal', true, now), /mới hơn/);
  const unauthorized = fixture(); unauthorized.activeUser.id = 'other-account';
  assert.throws(() => resolveAgreement(unauthorized, 'proposal', true, now), /đại diện/);
});
