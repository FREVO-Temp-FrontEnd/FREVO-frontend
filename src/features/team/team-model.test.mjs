import assert from "node:assert/strict";
import { test } from "node:test";
import { acceptTeamInvitation, parseTeam, parseTeams, validateTeam, validateInvitation } from "./team-model.ts";

const profile = {
  name: "Mây Creative", summary: "Thiết kế thương hiệu", discipline: "Thiết kế thương hiệu",
  members: [{ id: "leader", name: "Minh Anh", email: "minhanh@example.com", role: "Người đại diện", isLeader: true }],
  invitations: [{ id: "invite", email: "giahan@example.com", role: "Designer", message: "", status: "pending", sentAt: "2026-10-27T10:00:00.000Z", resent: false }],
};

test("group basics reject blank fields and unsupported disciplines", () => {
  assert.deepEqual(validateTeam(profile), {});
  assert.deepEqual(Object.keys(validateTeam({ name: "  ", summary: "", discipline: "unknown" })), ["name", "summary", "discipline"]);
  assert.ok(validateTeam({ ...profile, name: "a".repeat(61) }).name);
});

test("invites reject invalid, existing-member and case-insensitive pending emails", () => {
  const draft = { email: "not-an-email", role: "Designer", message: "" };
  assert.ok(validateInvitation(profile, draft).email);
  assert.match(validateInvitation(profile, { ...draft, email: " MINHANH@EXAMPLE.COM " }).email, /thành viên/);
  assert.match(validateInvitation(profile, { ...draft, email: " GIAHAN@EXAMPLE.COM " }).email, /chờ phản hồi/);
  assert.ok(validateInvitation(profile, { ...draft, email: "new@example.com", role: " " }).role);
  assert.ok(validateInvitation(profile, { ...draft, email: "new@example.com", message: "a".repeat(501) }).message);
});

test("revoked invitation permits a new invitation without adding a member", () => {
  const revoked = { ...profile, invitations: [{ ...profile.invitations[0], status: "revoked" }] };
  assert.deepEqual(validateInvitation(revoked, { email: "giahan@example.com", role: "Designer", message: "" }), {});
  assert.equal(revoked.members.length, 1);
});

test("stored group round-trips and rejects malformed data without resetting it", () => {
  assert.deepEqual(parseTeam(JSON.stringify(profile)), profile);
  assert.equal(parseTeam("null"), null);
  for (const raw of ["{", "[]", '{"name":"Mây"}', JSON.stringify({ ...profile, members: [] }), JSON.stringify({ ...profile, invitations: [{ ...profile.invitations[0], status: "invalid" }] }), JSON.stringify({ ...profile, invitations: [{ ...profile.invitations[0], sentAt: "invalid" }] })]) {
    assert.throws(() => parseTeam(raw));
  }
});

test("accepting a pending invitation adds one member and cannot be repeated", () => {
  const accepted = acceptTeamInvitation(profile, "invite", " Gia Hân ");
  assert.equal(accepted.members.length, 2);
  assert.deepEqual(accepted.members[1], { id: accepted.members[1].id, name: "Gia Hân", email: "giahan@example.com", role: "Designer", isLeader: false });
  assert.equal(accepted.invitations[0].status, "accepted");
  assert.deepEqual(parseTeam(JSON.stringify(accepted)), accepted);
  assert.throws(() => acceptTeamInvitation(accepted, "invite", "Gia Hân"), /không còn chờ/);
  assert.throws(() => acceptTeamInvitation(profile, "invite", " "), /tên thành viên/);
});

test("multiple stored groups keep separate identities and reject duplicate IDs", () => {
  const groups = [{ ...profile, id: "may" }, { ...profile, id: "cham", name: "Chạm Studio", invitations: [] }];
  assert.deepEqual(parseTeams(JSON.stringify(groups)), groups);
  assert.throws(() => parseTeams(JSON.stringify([{ ...groups[0], id: "may" }, { ...groups[1], id: "may" }])));
  assert.throws(() => parseTeams(JSON.stringify([{ ...groups[0], members: [] }])));
});
