import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { sha256Hex, hashPassword, isAdminValue } from "../app/composables/adminAuth.js";

const ref = (s) => createHash("sha256").update(s).digest("hex");

test("sha256Hex matches node crypto, incl. block boundaries and UTF-8", () => {
  for (const s of ["", "abc", "a".repeat(55), "a".repeat(56), "a".repeat(64), "a".repeat(200), "รหัสผ่าน ✓"]) {
    assert.equal(sha256Hex(s), ref(s));
  }
});

test("hashPassword uses the salt prefix", () => {
  assert.equal(hashPassword("pw"), ref("ostore-admin:pw"));
});

const hash = hashPassword("s3cret");

test("right password: admin", () => {
  assert.equal(isAdminValue("s3cret", hash), true);
});

test("wrong password: not admin", () => {
  assert.equal(isAdminValue("nope", hash), false);
});

test('cookie "1" (or number 1): not admin', () => {
  assert.equal(isAdminValue("1", hash), false);
  assert.equal(isAdminValue(1, hash), false);
});

test("empty configured hash: never admin", () => {
  assert.equal(isAdminValue("s3cret", ""), false);
  assert.equal(isAdminValue("", ""), false);
  assert.equal(isAdminValue(hashPassword(""), ""), false);
  assert.equal(isAdminValue("s3cret", undefined), false);
});

test("missing cookie: not admin", () => {
  assert.equal(isAdminValue(null, hash), false);
  assert.equal(isAdminValue("", hash), false);
});
