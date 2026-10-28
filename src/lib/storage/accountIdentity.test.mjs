import assert from "node:assert/strict";
import { test } from "node:test";
import { rememberAccountIdentity, resolveAccountIdentity } from "./accountIdentity.ts";

test("logout and repeated login preserve the original account ID", () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const user = { id: "user-123", email: " Person@example.com ", role: "freelancer" };
  rememberAccountIdentity(user, storage);
  rememberAccountIdentity({ id: "guest-user", email: "", role: "guest" }, storage);
  assert.equal(resolveAccountIdentity("person@example.com", storage), user.id);
  assert.equal(resolveAccountIdentity("PERSON@example.com", storage), user.id);
  assert.notEqual(resolveAccountIdentity("other@example.com", storage), user.id);
  assert.equal(resolveAccountIdentity("new@example.com", storage), resolveAccountIdentity("NEW@example.com", storage));
});

test("existing team ownership recovers a representative ID from before the fix", () => {
  const storage = { getItem: key => key === "frevo_team_management_v2:leader%40example.com" ? JSON.stringify([{ members: [{ id: "user-old", email: "leader@example.com", isLeader: true }] }]) : null };
  assert.equal(resolveAccountIdentity("leader@example.com", storage), "user-old");
  assert.notEqual(resolveAccountIdentity("member@example.com", storage), "user-old");
});
