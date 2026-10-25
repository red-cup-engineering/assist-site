import assert from "node:assert/strict";
import test from "node:test";
import worker, { createAssistWorker } from "../src/index.mjs";

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

test("the same source binding cannot reuse a different host configuration", async () => {
  const record = { id: "test-app", name: "Host-bound app", summary: "Source binding test.", owner: { repository: "example/test", path: "src" }, status: "specified", sources: ["README.md"] };
  const ASSIST_ROSTER = JSON.stringify({ records: [record] });
  const request = new Request("https://preview.example/apps/test-app", { headers: { accept: "application/json" } });
  assert.equal((await worker.fetch(request, { ASSIST_ROSTER })).status, 404);
  const configured = await worker.fetch(request, { ASSIST_ROSTER, ASSIST_APEX: "preview.example", ASSIST_HOST_MODE: "paths" });
  assert.equal(configured.status, 200);
  assert.equal((await configured.json()).title, "Host-bound app");
  assert.equal((await worker.fetch(request, { ASSIST_ROSTER })).status, 404);
});

test("an immutable bundled instance uses the original application without environment authority", async () => {
  const record = { id: "test-app", name: "Original source", summary: "Source binding test.", family: "product", owner: { repository: "example/test", path: "src" }, status: "specified", sources: ["README.md"] };
  const instance = createAssistWorker({ roster: { records: [record] }, apex: "preview.example", hostMode: "paths" });
  record.name = "Unadmitted later mutation";
  const response = await instance.fetch(new Request("https://preview.example/apps/test-app", { headers: { accept: "application/json" } }), { ASSIST_APEX: "foreign.example" });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).title, "Original source");
  assert.equal((await instance.fetch(new Request("https://foreign.example/"))).status, 404);
  assert.throws(() => createAssistWorker(), TypeError);
});
