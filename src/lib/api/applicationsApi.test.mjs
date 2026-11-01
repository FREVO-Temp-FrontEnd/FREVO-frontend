import assert from 'node:assert/strict';
import { File, Buffer } from 'node:buffer';
import { readFileSync } from 'node:fs';
import { URL } from 'node:url';
import { test } from 'node:test';
import ts from 'typescript';
const moduleUrl = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
const compile = source => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const imports = {
  './agent': moduleUrl('export default {}; export const isDemoMode = true;'),
  './projectsApi': moduleUrl('export const projectsApi = {};'),
  '@/lib/storage/mockStorage': moduleUrl('export const mockStorage = { getActiveUser: () => ({ id: "account", role: "freelancer" }), getApplicantTalentId: () => "talent", getCandidates: () => [{ projectId: "project", talentId: "talent", source: "Ứng tuyển", applicantAccountId: "account", status: "not_selected" }] };'),
  '@/lib/storage/applicationSubmission': moduleUrl('export const createApplicationSubmission = async () => { throw new Error("Must not save a duplicate submission"); };'),
  '@/lib/storage/resumeStorage': moduleUrl('export const readSubmittedResumeFile = () => {};'),
  '@/lib/storage/representedTeams': moduleUrl('export const readRepresentedTeams = () => [];'),
  '@/lib/utils/validateResumeFile': moduleUrl(compile(readFileSync(new URL('../utils/validateResumeFile.ts', import.meta.url), 'utf8'))),
};
let source = compile(readFileSync(new URL('./applicationsApi.ts', import.meta.url), 'utf8'));
for (const [path, url] of Object.entries(imports)) source = source.replace(JSON.stringify(path), JSON.stringify(url));
const { applicationsApi } = await import(moduleUrl(source));
test('previously submitted applications cannot be sent again, including closed applications', async () => {
  await assert.rejects(applicationsApi.submit({ projectId: 'project', applicantIdentity: 'individual', proposal: 'Updated proposal', resume: { mode: 'upload', file: new File(['demo CV'], 'cv.pdf', { type: 'application/pdf' }) } }), /đã ứng tuyển/);
});
