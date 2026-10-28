import assert from "node:assert/strict";
import { test } from "node:test";
import { applicationTeamIds, canManageApplication } from "./applicationAccess.ts";

test("team applications are visible to members, but only the submitting account manages them", () => {
  const user = { id: "member", email: " Member@example.com ", role: "freelancer" };
  const team = { id: "team-1", members: [{ id: "leader", email: "leader@example.com", isLeader: true }, { id: "random-member-id", email: "member@example.com" }], invitations: [{ email: "pending@example.com" }] };
  const values = new Map([["frevo_team_management_v2:leader", JSON.stringify([team])], ["frevo_team_management_v2:broken", "{"]]);
  const storage = { length: values.size, key: index => [...values.keys()][index], getItem: key => values.get(key) ?? null };
  assert.deepEqual([...applicationTeamIds(user, storage)], ["managed-team:leader:team-1"]);
  assert.equal(applicationTeamIds({ ...user, email: "pending@example.com" }, storage).size, 0);
  assert.equal(applicationTeamIds({ ...user, role: "client" }, storage).size, 0);
  const candidate = { talentId: "managed-team:leader:team-1", applicantAccountId: "leader" };
  assert.equal(canManageApplication(candidate, user), false);
  assert.equal(canManageApplication(candidate, { ...user, id: "leader" }), true);
  assert.equal(canManageApplication({ talentId: "member" }, user), true);
  assert.equal(canManageApplication({ talentId: "minh-anh" }, user), true);
  assert.equal(canManageApplication({ talentId: "minh-anh", applicantAccountId: "someone-else" }, user), false);
  team.members.pop();
  values.set("frevo_team_management_v2:leader", JSON.stringify([team]));
  assert.equal(applicationTeamIds(user, storage).size, 0);
});
