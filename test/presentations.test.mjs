import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createAssistWorker } from "../src/index.mjs";

test("the immutable cloud seat passes explicit presentations to the original ASSIST owner", async () => {
  assert.ok(process.env.ASSIST_TEST_ROSTER_PATH, "Actual original instance input is required");
  const roster = await readFile(process.env.ASSIST_TEST_ROSTER_PATH, "utf8");
  const presentations = [
    { apex: "assist.provider.example", hostMode: "paths" },
    { apex: "assist.561.group", hostMode: "subdomains", except: ["kalshi"] },
  ];
  const worker = createAssistWorker({ roster, presentations });
  for (const url of ["https://assist.provider.example/", "https://assist.561.group/",
    "https://vechain.assist.561.group/", "https://assist.provider.example/apps/kalshi"]) {
    const response = await worker.fetch(new Request(url, { headers: { accept: "application/json" } }));
    assert.equal(response.status, 200, url);
  }
  presentations[0].apex = "unselected.example";
  presentations[1].except.length = 0;
  for (const host of ["unselected.example", "kalshi.assist.561.group"]) {
    assert.equal((await worker.fetch(new Request(`https://${host}/`))).status, 404, host);
  }
  assert.throws(() => createAssistWorker({ roster, apex: "assist.provider.example", presentations }), TypeError);
});
