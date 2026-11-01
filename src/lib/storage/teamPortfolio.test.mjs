import assert from 'node:assert/strict';
import { test } from 'node:test';
import { publicTeamMembers, publicTeamWorks, validateTeamWork, canManageTeamPortfolio } from './teamPortfolio.ts';
const members = [{ id: 'leader', name: 'Minh Anh', role: 'Design', isLeader: true }];
const work = { id: 'work', title: 'Nhận diện Mộc', category: 'Brand', role: 'Team design', description: 'Identity', contribution: 'Logo', date: '2026-05', visibility: 'public', url: '', media: [{ id: 'image', kind: 'image', src: '/assets/cover.webp' }], contributors: [{ memberId: 'leader', name: 'Minh Anh', role: 'Art direction' }] };
test('team public roster never exposes member emails or invitation fields', () => {
  assert.deepEqual(publicTeamMembers([{ ...members[0], email: 'private@example.com', invitation: 'pending' }]), members);
});
test('only the representative can manage team work; contributor credit grants no edit access', () => {
  const team = { kind: 'Team', teamLeaderId: 'leader' };
  assert.equal(canManageTeamPortfolio(team, { id: 'leader', role: 'freelancer' }), true);
  assert.equal(canManageTeamPortfolio(team, { id: 'member', role: 'freelancer' }), false);
  assert.equal(canManageTeamPortfolio(team, { id: 'leader', role: 'client' }), false);
});
test('public portfolio excludes private works and puts featured works first without changing stored order', () => {
  const works = [{ ...work, id: 'normal' }, { ...work, id: 'private', visibility: 'private', featured: true }, { ...work, id: 'featured', featured: true }];
  assert.deepEqual(publicTeamWorks(works).map(item => item.id), ['featured', 'normal']);
  assert.deepEqual(works.map(item => item.id), ['normal', 'private', 'featured']);
});
test('team work requires valid media and actual member contributions', () => {
  assert.equal(validateTeamWork(work, members), '');
  assert.match(validateTeamWork({ ...work, contributors: [] }, members), /thành viên/);
  assert.match(validateTeamWork({ ...work, contributors: [{ memberId: 'stranger', name: 'Other', role: 'Design' }] }, members), /thành viên/);
  assert.match(validateTeamWork({ ...work, media: [] }, members), /ảnh bìa/);
  assert.match(validateTeamWork({ ...work, media: [{ kind: 'image', src: 'javascript:alert(1)' }] }, members), /hợp lệ/);
  assert.match(validateTeamWork({ ...work, url: 'javascript:alert(1)' }, members), /Liên kết/);
});
