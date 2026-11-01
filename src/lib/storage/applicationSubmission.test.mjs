import assert from 'node:assert/strict';
import { File, Buffer } from 'node:buffer';
import { readFileSync } from 'node:fs';
import { URL } from 'node:url';
import { test } from 'node:test';
import ts from 'typescript';
const moduleUrl = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
const compile = source => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const resumeStorage = moduleUrl('export const readResumes = async () => []; export const seedMinhAnhResumes = async () => {}; export const saveApplicationFile = async () => "saved-cv";');
const validation = moduleUrl(compile(readFileSync(new URL('../utils/validateResumeFile.ts', import.meta.url), 'utf8')));
const source = compile(readFileSync(new URL('./applicationSubmission.ts', import.meta.url), 'utf8')).replace('"./resumeStorage"', JSON.stringify(resumeStorage)).replace('"@/lib/utils/validateResumeFile"', JSON.stringify(validation));
const { createApplicationSubmission } = await import(moduleUrl(source));
test('new application preserves CV and proposal terms without attaching portfolio assets', async () => {
  const submission = await createApplicationSubmission({ ownerId: 'owner', talentId: 'talent', works: [{ id: 'private-work', visibility: 'public' }], request: {
    applicantIdentity: 'individual', portfolioWorkIds: ['private-work'], portfolioUrl: 'https://example.com/private',
    resume: { mode: 'upload', file: new File(['demo CV'], 'cv.pdf', { type: 'application/pdf' }) }, proposedBudget: 12000000, deliveryEstimate: '4 tuần',
  } });
  assert.deepEqual(submission.portfolioWorks, []);
  assert.equal(submission.portfolioUrl, undefined);
  assert.equal(submission.resume.name, 'cv.pdf');
  assert.equal(submission.resume.fileId, 'saved-cv');
  assert.equal(submission.proposedBudget, 12000000);
  assert.equal(submission.deliveryEstimate, '4 tuần');
});
