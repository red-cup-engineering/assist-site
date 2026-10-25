import assert from "node:assert/strict";
import test from "node:test";
import worker from "../src/index.mjs";

test("Worker requires an explicit roster and uses the real ASSIST application", async () => {
  const request = new Request("https://test-app.assist.561.group/", { headers: { accept: "application/json" } });
  for (const ASSIST_ROSTER of [undefined, "{", JSON.stringify({ records: [{ private: "REDACTED" }] })]) {
    const unavailable = await worker.fetch(request, { ASSIST_ROSTER });
    assert.equal(unavailable.status, 503);
    assert.match(unavailable.headers.get("content-type"), /application\/problem\+json/);
    assert.doesNotMatch(await unavailable.text(), /REDACTED/);
  }
  const record = { id: "test-app", name: "Test App", summary: "Synthetic consumer contract test.", family: "product", owner: { repository: "example/test", path: "src" }, status: "specified", sources: ["README.md"] };
  const response = await worker.fetch(request, { ASSIST_ROSTER: JSON.stringify({ records: [record], conditions: {} }) });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).title, "Test App");
});

test("a changed or missing binding cannot reuse a previously admitted app", async () => {
  const record = { id: "test-app", name: "First binding", summary: "Source binding test.", owner: { repository: "example/test", path: "src" }, status: "specified", sources: ["README.md"] };
  const request = new Request("https://test-app.assist.561.group/", { headers: { accept: "application/json" } });
  const read = async binding => worker.fetch(request, { ASSIST_ROSTER: binding });
  const first = JSON.stringify({ records: [record] });
  assert.equal((await (await read(first)).json()).title, "First binding");
  assert.equal((await (await read(first)).json()).title, "First binding");
  assert.equal((await read(undefined)).status, 503);
  const second = JSON.stringify({ records: [{ ...record, name: "Second binding" }] });
  assert.equal((await (await read(second)).json()).title, "Second binding");
});
