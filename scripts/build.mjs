#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { build, version as esbuildVersion } from 'esbuild';
import { boundAssistRecordSet } from '@red-cup-engineering/assist/records';
import { createAssistWorker } from '../src/index.mjs';

const args = process.argv.slice(2), options = {};
for (let i = 0; i < args.length; i += 2) {
  if (!['--roster', '--apex', '--host-mode', '--presentations', '--out'].includes(args[i]) || !args[i + 1] || options[args[i]])
    throw new TypeError('Build requires --roster PATH --out FILE and optionally --apex HOST --host-mode paths|subdomains or --presentations PATH');
  options[args[i]] = args[i + 1];
}
if (!options['--roster'] || !options['--out']) throw new TypeError('An explicit source roster and output file are required');
const inputPath = resolve(options['--roster']), outfile = resolve(options['--out']);
const source = await readFile(inputPath, 'utf8');
const { records } = boundAssistRecordSet(source);
if (records.some(record => (record.family ?? 'product') !== 'product')) throw new TypeError('A public ASSIST build accepts product records only');
const configuration = { roster: source, ...(options['--apex'] ? { apex: options['--apex'] } : {}),
  ...(options['--host-mode'] ? { hostMode: options['--host-mode'] } : {}),
  ...(options['--presentations'] ? { presentations: JSON.parse(await readFile(resolve(options['--presentations']), 'utf8')) } : {}) };
createAssistWorker(configuration); // Original application admission, before producing an artifact.
const directory = dirname(fileURLToPath(import.meta.url));
const result = await build({ stdin: { contents: `import { createAssistWorker } from '../src/index.mjs';\nexport default createAssistWorker(${JSON.stringify(configuration)});\n`,
    resolveDir: directory, sourcefile: 'assist-instance.mjs', loader: 'js' },
  bundle: true, platform: 'browser', format: 'esm', target: 'es2022', outfile, write: false, metafile: true,
});
if (Object.values(result.metafile.outputs).some(output => output.imports.length)) throw new TypeError('ASSIST public artifact has unresolved runtime imports');
await mkdir(dirname(outfile), { recursive: true });
await writeFile(outfile, result.outputFiles[0].contents);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const receipt = { kind: 'assist.public-release-input', esbuildVersion, rosterSha256: digest(source),
  outputSha256: digest(result.outputFiles[0].contents), bytes: result.outputFiles[0].contents.length,
  ...(configuration.presentations === undefined
    ? { apex: configuration.apex ?? 'assist.561.group', hostMode: configuration.hostMode ?? 'subdomains' }
    : { presentations: configuration.presentations }),
  apps: records.map(record => record.id), externalImports: 0, publicDeployment: false };
await writeFile(outfile + '.receipt.json', JSON.stringify(receipt, null, 2) + '\n');
await writeFile(outfile + '.metafile.json', JSON.stringify(result.metafile, null, 2) + '\n');
process.stdout.write(JSON.stringify(receipt) + '\n');
