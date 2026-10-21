import assert from "node:assert/strict";
import test from "node:test";
import worker from "../src/index.mjs";

test("Worker requires an explicit roster and uses the real ASSIST application", async () => {
  const request = new Request("https://test-app.assist.561.group/", { headers: { accept: "application/json" } });
  assert.throws(() => worker.fetch(request, {}), { code: "ASSIST_INSTANCE_RECORDS_REQUIRED" });
  const record = { id: "test-app", name: "Test App", summary: "Synthetic consumer contract test.", family: "product", owner: { repository: "example/test", path: "src" }, status: "specified", sources: ["README.md"] };
  const response = await worker.fetch(request, { ASSIST_ROSTER: JSON.stringify({ records: [record], conditions: {} }) });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).title, "Test App");
});
