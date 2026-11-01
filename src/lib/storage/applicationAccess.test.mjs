import assert from "node:assert/strict";
import { test } from "node:test";
import { applicationTeamIds, canManageApplication, canManageWorkspace } from "./applicationAccess.ts";

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

test('team representative can open and submit workspace regardless of current acting identity', () => {
 const agreement = {projectId:'project',talentId:'managed-team:leader:team-1'};
 const candidates = [{...agreement,applicantAccountId:'leader',status:'selected'}];
 const owner = {id:'leader',role:'freelancer',actingIdentity:{type:'individual'}};
 assert.equal(canManageWorkspace(agreement,candidates,owner),true);
 assert.equal(canManageWorkspace(agreement,candidates,{...owner,actingIdentity:{type:'team',teamId:'another-team'}}),true);
 assert.equal(canManageWorkspace(agreement,candidates,{...owner,id:'member'}),false);
 assert.equal(canManageWorkspace(agreement,candidates,{...owner,role:'client'}),false);
 assert.equal(canManageWorkspace({...agreement,projectId:'other'},candidates,owner),false);
 assert.equal(canManageWorkspace({...agreement,talentId:'other'},candidates,owner),false);
 assert.equal(canManageWorkspace(agreement,[{...candidates[0],status:'discussing'}],owner),false);
 assert.equal(canManageWorkspace(agreement,[],owner),false);
});
