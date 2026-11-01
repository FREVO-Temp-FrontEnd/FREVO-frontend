import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { readFileSync } from 'node:fs';
import { URL } from 'node:url';
import { test } from 'node:test';
import ts from 'typescript';
const source = ts.transpileModule(readFileSync(new URL('./businessAccount.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { applyBusinessAccountUpdate, businessAccountFields, validateBusinessAccount } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const user = { id: 'business-owner', role: 'client', name: 'Nguyễn Thuận', email: 'thuan@nangstudio.vn', companyName: 'Nắng Studio', verified: true };
const state = { activeUser: user, projects: [{ id: 'owned', company: user.companyName, briefVersion: 3, briefHistory: [{ before: { company: user.companyName } }] }, { id: 'other', company: 'Other Studio' }], candidates: [{ id: 'applicant', projectId: 'owned' }], invitations: [{ id: 'invite', projectId: 'owned' }] };

test('required fields have inline validation, optional blank contact fields are accepted', () => {
  assert.deepEqual(validateBusinessAccount(businessAccountFields(user)), {});
  const errors = validateBusinessAccount({ ...businessAccountFields(user), companyName: ' ', name: ' ', email: 'invalid', phone: 'abc', contactEmail: 'invalid' });
  for (const field of ['companyName', 'name', 'email', 'phone', 'contactEmail']) assert.ok(errors[field]);
});
test('renaming a company preserves project ownership without rewriting history or other businesses', () => {
  const next = applyBusinessAccountUpdate(state, { ...businessAccountFields(user), companyName: '  Nắng Creative  ', phone: '+84 901 234 567' }, user);
  assert.equal(next.activeUser.companyName, 'Nắng Creative');
  assert.equal(next.projects[0].company, 'Nắng Creative');
  assert.equal(next.projects[1], state.projects[1]);
  assert.equal(next.projects[0].briefVersion, 3);
  assert.equal(next.projects[0].briefHistory, state.projects[0].briefHistory);
  assert.equal(next.candidates, state.candidates);
  assert.equal(next.invitations, state.invitations);
  assert.equal(state.activeUser.companyName, 'Nắng Studio');
});
test('account updates preserve session identity, role and unrelated properties', () => {
  const next = applyBusinessAccountUpdate(state, { ...businessAccountFields(user), email: '  NEW@NANGSTUDIO.VN  ', contactEmail: ' HELLO@NANGSTUDIO.VN ' }, user);
  assert.equal(next.activeUser.email, 'new@nangstudio.vn');
  assert.equal(next.activeUser.contactEmail, 'hello@nangstudio.vn');
  assert.equal(next.activeUser.id, user.id);
  assert.equal(next.activeUser.role, user.role);
  assert.equal(next.activeUser.verified, true);
});
test('changed sessions and stale account edits are rejected without mutating data', () => {
  for (const activeUser of [{ ...user, id: 'other' }, { ...user, role: 'freelancer' }, { ...user, name: 'Updated elsewhere' }]) {
    assert.throws(() => applyBusinessAccountUpdate({ ...state, activeUser }, businessAccountFields(user), user));
  }
  assert.equal(state.projects[0].company, 'Nắng Studio');
});
test('company names already attached to another workspace cannot merge ownership', () => {
  assert.throws(() => applyBusinessAccountUpdate(state, { ...businessAccountFields(user), companyName: 'Other Studio' }, user), /không gian dự án khác/);
});
