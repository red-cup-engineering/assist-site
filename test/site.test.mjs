import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import worker from "../src/index.mjs";

test("the seat serves the dashboard and an app by host", async () => {
  assert.ok(process.env.ASSIST_TEST_ROSTER_PATH, "Original site receiving requires explicit ASSIST_TEST_ROSTER_PATH from the instance custodian");
  const env = { ASSIST_ROSTER: JSON.parse(await readFile(process.env.ASSIST_TEST_ROSTER_PATH, "utf8")) };
  const dashboard = await worker.fetch(new Request("https://assist.561.group/", { headers: { accept: "text/html" } }), env);
  assert.equal(dashboard.status, 200);
  assert.match(await dashboard.text(), /kalshi\.assist\.561\.group/);
  const kalshi = await worker.fetch(new Request("https://kalshi.assist.561.group/", { headers: { accept: "application/json" } }), env);
  assert.equal((await kalshi.json()).title, "Kalshi Assist");
});
