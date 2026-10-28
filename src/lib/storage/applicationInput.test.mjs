import assert from "node:assert/strict";
import { File } from "node:buffer";
import { test } from "node:test";
import { readRepresentedTeams } from "./representedTeams.ts";
import { validateResumeFile } from "../utils/validateResumeFile.ts";

test("application sees only teams stored for the current freelancer", () => {
  const values = new Map([["frevo_team_management_v2:minhanh%40example.com", JSON.stringify([
    { id: "may", name: "Mây Creative", summary: "Thiết kế thương hiệu", discipline: "Thiết kế thương hiệu", members: [{ id: "leader" }] },
  ])]]);
  globalThis.localStorage = { getItem: key => values.get(key) ?? null };
  assert.deepEqual(readRepresentedTeams({ id: "minh-anh", email: "MinhAnh@example.com" }), [
    { id: "may", name: "Mây Creative", summary: "Thiết kế thương hiệu", discipline: "Thiết kế thương hiệu", memberCount: 1 },
  ]);
  assert.deepEqual(readRepresentedTeams({ id: "other", email: "other@example.com" }), []);
  values.set("frevo_team_management_v2:minhanh%40example.com", "not json");
  assert.throws(() => readRepresentedTeams({ id: "minh-anh", email: "minhanh@example.com" }));
  delete globalThis.localStorage;
});

test("application CV uses the same file limits as profile CV", () => {
  assert.equal(validateResumeFile(new File(["cv"], "profile.pdf", { type: "application/pdf" })), null);
  assert.match(validateResumeFile(new File(["cv"], "profile.png", { type: "image/png" })), /PDF/);
  assert.match(validateResumeFile(new File(["cv"], "profile.pdf", { type: "image/png" })), /không khớp/);
  assert.match(validateResumeFile(new File([], "empty.pdf", { type: "application/pdf" })), /trống/);
  assert.match(validateResumeFile(new File([new Uint8Array(5 * 1024 * 1024 + 1)], "large.pdf", { type: "application/pdf" })), /5 MB/);
});
