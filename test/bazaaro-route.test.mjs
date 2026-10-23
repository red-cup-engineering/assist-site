import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const wrangler = readFileSync(join(root, "wrangler.jsonc"), "utf8");

test("Bazaaro's selected exact hostname has one explicit shared ASSIST Worker route", () => {
  assert.equal((wrangler.match(/"pattern":\s*"bazaaro\.561\.group\/\*"/g) ?? []).length, 1);
  assert.match(wrangler, /\{\s*"pattern":\s*"bazaaro\.561\.group\/\*",\s*"zone_name":\s*"561\.group"\s*\}/);
  assert.match(wrangler, /"pattern":\s*"assist\.561\.group\/\*"/);
  assert.match(wrangler, /"pattern":\s*"\*\.assist\.561\.group\/\*"/);
  assert.doesNotMatch(wrangler, /"name":\s*"bazaaro-/);
});

test("the original instance roster remains required; a route confers no market or signing grant", () => {
  const worker = readFileSync(join(root, "src/index.mjs"), "utf8");
  assert.match(worker, /boundAssistRecordSet\(env\?\.ASSIST_ROSTER\)/);
  assert.doesNotMatch(worker, /const assistAppRecords\s*=/);
  assert.doesNotMatch(worker, /sendTransaction|wallet\.sign|marketOrder/);
});
