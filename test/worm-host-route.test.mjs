import assert from "node:assert/strict";
import test from "node:test";
import worker from "../src/index.mjs";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const wrangler = readFileSync(join(root, "wrangler.jsonc"), "utf8");

test("Worm Assist's requested exact first-party hostname uses the one shared ASSIST Worker", () => {
  assert.equal((wrangler.match(/"pattern":\s*"worm-assist\.561\.group\/\*"/gu) ?? []).length, 1);
  assert.match(wrangler, /\{\s*"pattern":\s*"worm-assist\.561\.group\/\*",\s*"zone_name":\s*"561\.group"\s*\}/u);
  assert.match(wrangler, /"pattern":\s*"assist\.561\.group\/\*"/u);
  assert.match(wrangler, /"pattern":\s*"\*\.assist\.561\.group\/\*"/u);
  assert.match(wrangler, /"pattern":\s*"bazaaro\.561\.group\/\*"/u, "stacked existing exact host is not dropped");
  assert.equal((wrangler.match(/"name":\s*"assist-561-group"/gu) ?? []).length, 1);
});

test("the Worker still demands the real original ASSIST_ROSTER rather than inventing a Worm identity", async () => {
  const js = readFileSync(join(root,"src/index.mjs"),"utf8");
  assert.equal((await worker.fetch(new Request("https://worm-assist.561.group/"), {})).status, 503);
  assert.doesNotMatch(js,/const\s+(?:worm|WormApp|assistAppRecords)\s*=/u);
  assert.doesNotMatch(js,/wallet\.sign|sendTransaction|fetch\(["']https:\/\/quickstats/u);
});
