import assert from "node:assert/strict";
import test from "node:test";
import worker from "../src/index.mjs";

test("the seat serves the dashboard and an app by host", async () => {
  const dashboard = await worker.fetch(new Request("https://assist.561.group/", { headers: { accept: "text/html" } }), {});
  assert.equal(dashboard.status, 200);
  assert.match(await dashboard.text(), /kalshi\.assist\.561\.group/);
  const kalshi = await worker.fetch(new Request("https://kalshi.assist.561.group/", { headers: { accept: "application/json" } }), {});
  assert.equal((await kalshi.json()).title, "Kalshi Assist");
});
