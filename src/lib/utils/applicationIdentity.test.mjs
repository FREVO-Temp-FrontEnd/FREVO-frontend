import assert from 'node:assert/strict';
import { test } from 'node:test';
import { applicationIdentity } from './applicationIdentity.ts';

test('application identity uses submitted identity and team name before the current profile', () => {
 const candidate = { talentId: 'team-id', submission: { applicantIdentity: 'team', teamAtSubmission: { name: 'Mây Creative' } } };
 assert.equal(applicationIdentity(candidate, {kind: 'Team', name: 'Renamed studio'}).label, 'Ứng tuyển theo nhóm · Mây Creative');
 assert.equal(applicationIdentity({...candidate, submission: {applicantIdentity: 'individual'}}, {kind: 'Team'}).label, 'Ứng tuyển cá nhân');
});

test('legacy applications use their talent profile and unknown identities are not labeled as individual', () => {
 assert.equal(applicationIdentity({talentId: 'old'}, {kind:'Team', name:'Studio Dâu'}).isTeam, true);
 assert.equal(applicationIdentity({talentId: 'old'}, {kind:'Cá nhân'}).label, 'Ứng tuyển cá nhân');
 assert.match(applicationIdentity({talentId: 'managed-team:owner:group'}).label, /Ứng tuyển theo nhóm/);
 assert.match(applicationIdentity({talentId: 'missing'}).label, /Chưa có thông tin/);
});
