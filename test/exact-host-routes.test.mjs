import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const source = path => readFileSync(new URL(path, root), 'utf8');
const config = JSON.parse(source('wrangler.jsonc').replace(/^\s*\/\/[^\n]*(?:\n|$)/gmu, ''));

test('both original exact aliases share the source-built immutable-roster ASSIST Worker', () => {
  assert.equal(config.name, 'assist-561-group');
  assert.equal(config.main, 'dist/worker.mjs', 'never restore old unbundled Worker');
  assert.equal(config.workers_dev, false);
  assert.deepEqual(config.routes, [
    { pattern: 'assist.561.group/*', zone_name: '561.group' },
    { pattern: '*.assist.561.group/*', zone_name: '561.group' },
    { pattern: 'bazaaro.561.group/*', zone_name: '561.group' },
    { pattern: 'worm-assist.561.group/*', zone_name: '561.group' },
  ]);
  assert.equal(new Set(config.routes.map(route => route.pattern)).size, config.routes.length);
});

test('host aliases preserve original admitted application and do not create a second market', () => {
  const worker = source('src/index.mjs');
  const builder = source('scripts/build.mjs');
  assert.match(worker, /createAssistApplication\(/u);
  assert.match(worker, /boundAssistRecordSet\(binding\)/u);
  assert.match(worker, /applicationFor\(env\?\.ASSIST_ROSTER/u);
  assert.doesNotMatch(worker, /wallet\.sign|sendTransaction|marketOrder/u);
  assert.match(builder, /boundAssistRecordSet\(source\)/u);
  assert.match(builder, /createAssistWorker\(configuration\)/u);
  assert.match(builder, /externalImports: 0, publicDeployment: false/u);
  assert.doesNotMatch(builder, /const\s+assistAppRecords\s*=/u);
});
