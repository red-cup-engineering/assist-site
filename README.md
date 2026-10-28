# assist-site

<!-- 561-group-standards:badges:start -->
[![Red Cup Engineering](https://img.shields.io/badge/561%20Group-Red%20Cup%20Engineering-c0392b)](https://github.com/red-cup-engineering)
[![License: MIT](https://img.shields.io/badge/license-MIT-c0392b)](LICENSE)
[![Indigenous data: CARE](https://img.shields.io/badge/Indigenous%20data-CARE-4b6f44)](https://github.com/red-cup-engineering/.github/blob/main/GOVERNANCE.md)
[![Tips welcome](https://img.shields.io/badge/tips-welcome-d4a017)](https://github.com/561-group/.github/blob/main/TIPS.md)
<!-- 561-group-standards:badges:end -->

The Cloudflare Worker seat of ASSIST: serves the assist.561.group dashboard and every Assist app at <id>.assist.561.group from one roster. Carries no logic of its own.

## Build one explicit public instance

The Worker imports the original shared ASSIST application. Its execution path is
ASSIST → MOOSE source application → Living Web Server → TUFTE Fetch rendering.
There is no site-local router, HTML renderer, wallet or account database.

Supply the existing instance custodian's `{ "records": [...], "conditions": {...} }`
JSON file. The public build admits it with ASSIST's original schema and refuses
personal-family records. It bundles that exact input into the Worker rather
than putting a full roster into a Cloudflare environment variable. Cloudflare's
per-variable limit is 5 KB; an estate roster can be much larger. The input
remains source-owned instance data, not a new registry in the shared package.

```sh
npm install
npm run build -- --roster /instance/assist-public-roster.json --out dist/worker.mjs
```

For an authorized host with one hostname and no per-app DNS records, use the
same application in path mode:

```sh
npm run build -- --roster /instance/assist-public-roster.json --apex assist.example.org --host-mode paths --out dist/worker.mjs
```

That configuration serves the hub at `/`, every selected app at `/apps/<id>`,
and the original JSON interfaces at `/api/apps` and `/api/apps/<id>/earning`.
Hub, app and daily-plan links retain the selected `?day=YYYY-MM-DD`. In path
mode the machine roster keeps canonical app identities such as
`vechain.assist.561.group`, while its `url` identifies the actual configured
host. An unselected hostname is refused; the adapter never rewrites responses.

The build invokes the original `createAssistWorker` admission before emitting
an artifact, and emits `worker.mjs.receipt.json` with the input and output
SHA-256, exact build version, selected apps, hostname and mode. It refuses
unresolved runtime imports. The output is a self-contained ESM Worker; Node
compatibility is unnecessary. The bundled snapshot is immutable for that
release and cannot be changed by a request or environment object.

## Receive and deploy the artifact

### Preserve an existing cloud origin while restoring canonical hostnames

The same original application can receive several explicit presentations from
one source-owned JSON file. For example:

```json
[
  { "apex": "assist.provider.example", "hostMode": "paths" },
  { "apex": "assist.561.group", "hostMode": "subdomains", "except": ["kalshi"] }
]
```

```sh
npm run build -- --roster /instance/assist-public-roster.json --presentations /instance/assist-presentations.json --out dist/worker.mjs
```

Each face keeps its own navigation and the original canonical app identities.
The original ASSIST application admits the full hostname set before building;
ambiguous hosts, unknown exclusions and mixed `--presentations` with legacy
`--apex` or `--host-mode` inputs refuse. It uses the same MOOSE resource routing,
source authorization and method boundary. The Worker does not rewrite URLs or
responses and adds no second route parser.

The `except` list preserves a standalone native app's subdomain handler. Its
public `/apps/:id` guide remains readable at admitted roots. A cloud host must
attach only the selected domain names, preserving the existing Kalshi backend.
Building or deploying this bundle does not create DNS records, attach a custom
hostname or establish TLS. Keep each missing external binding explicit until
independent public receiving succeeds.

Run the original instance receiving test with
`ASSIST_TEST_ROSTER_PATH=/absolute/path/to/instance-roster.json npm test`.
The supplied file must contain the actual authorized roster, including its
existing Kalshi record. Separate synthetic tests check missing, malformed,
replaced and host-scoped bindings; they do not replace instance receiving.

`npm run deploy` uses `dist/worker.mjs`, the existing `wrangler.jsonc` routes and
the host's already-authorized deployment writer. Another existing cloud host
can serve the identical ESM artifact with its own selected hostname. Before
release, receive the exact dependency cohort and test the actual artifact in
the target runtime, then independently read the published hub and every
selected app. Build receipts and local tests are not public-deployment
receipts. Existing native apps, such as the protected Kalshi workspace, retain
their original host handlers and authentication; a public guide does not
replace portfolio, account or financial services.

### Exact first-party ASSIST consumer routes

The original single Worker source configuration has explicit zone routes for
`bazaaro.561.group/*` and `worm-assist.561.group/*` alongside
`assist.561.group/*` and `*.assist.561.group/*`. This receives the original
source-only route requirements formerly carried by Worker PRs #2 and #3
without reverting the immutable `dist/worker.mjs` build selected on `main`.

A route is **not** a functioning product or authorization. To go live, the
independently authorized host custodian must supply a compatible published
ASSIST runtime with the original source-record `alternateHosts` admission,
the exact Bazaaro and Worm application records, selected immutable roster,
DNS/TLS and Cloudflare zone bindings, and independent HTTP journeys at both
hostnames. Source records and production conditions remain owned by the
respective original enterprise/service and operations systems. Until then
these host aliases are only release candidates; they confer no market,
payment, sensor, customer-data or Work authority.

## Small binding compatibility

The default export continues to support `ASSIST_ROSTER` as an object or JSON
string for existing hosts with small instance inputs. Optional `ASSIST_APEX`
and `ASSIST_HOST_MODE` select that host's presentation. A missing or invalid
binding returns a generic HTTP 503 problem response; a changed or removed
binding cannot reuse an older application. The immutable string cache includes
the hostname and mode. Object bindings are admitted on every request.

## Exact release cohort

Candidate `0.2.2-dev.0` selects ASSIST `0.7.2-dev.0`, MOOSE
`0.1.0-dev.3`, Living Web Server `0.1.0-dev.11` and TUFTE
`0.17.0-dev.0`. A source-built cohort may be used before registry publication
when the host explicitly selects and verifies each original archive; version
strings alone do not qualify an installation. The application remains a public
read-only guide until its original authenticated providers are separately
installed and admitted. Public provider rules do not assert that a visitor has
passed KYC, completed a task or earned a reward.

ASSIST's allocation preview remains an authenticated provider capability. Its
host must admit the principal, immutable Player-Character strategy, settled
earning receipts and allocation inputs. Selecting this package does not expose
that operation through the public Worker or turn visitor input into evidence.

Cloudflare limits: https://developers.cloudflare.com/workers/platform/limits/
