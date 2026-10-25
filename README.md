# assist-site

<!-- 561-group-standards:badges:start -->
[![Red Cup Engineering](https://img.shields.io/badge/561%20Group-Red%20Cup%20Engineering-c0392b)](https://github.com/red-cup-engineering)
[![License: MIT](https://img.shields.io/badge/license-MIT-c0392b)](LICENSE)
[![Indigenous data: CARE](https://img.shields.io/badge/Indigenous%20data-CARE-4b6f44)](https://github.com/red-cup-engineering/.github/blob/main/GOVERNANCE.md)
[![Tips welcome](https://img.shields.io/badge/tips-welcome-d4a017)](https://github.com/561-group/.github/blob/main/TIPS.md)
<!-- 561-group-standards:badges:end -->

The Cloudflare Worker seat of ASSIST: serves the assist.561.group dashboard and every Assist app at <id>.assist.561.group from one roster. Carries no logic of its own.

## Instance binding and release

The existing instance custodian must supply the `ASSIST_ROSTER` Worker binding as
the admitted `{ records, conditions }` object or its JSON serialization. The
shared engine package supplies schema and behavior; it supplies no instance's
people, app records or journal as a default. A missing or invalid binding returns
a generic HTTP 503 problem response. A changed or removed binding cannot reuse
an older admitted application.

This seat uses the shared ASSIST application, which is downstream of MOOSE's
Fetch source application, Living Web Server and TUFTE. An immutable string
binding reuses one admitted application per Worker isolate. Object bindings are
admitted on each request, so host mutations are not hidden by that cache.

Run the original instance receiving test with
`ASSIST_TEST_ROSTER_PATH=/absolute/path/to/instance-roster.json npm test`.
That file must contain the actual authorized instance roster, including its
existing Kalshi record; the test does not substitute an example roster when the
instance input is absent. Separate tests check missing, malformed and replaced
bindings with explicitly synthetic records.

`npm run deploy` uses the existing `wrangler.jsonc` routes and the host's existing
Cloudflare authority. Before release, receive the pinned engine package and its
upstream dependency versions, bind the actual roster, and independently read
the hub and every selected host. This repository has no deployment workflow or
embedded account credential. Source integration and local receiving do not
establish DNS, routes, an installed binding or a public deployment. Native app
hosts already served by their own upstream engines must retain those handlers;
the shared catalogue does not replace protected portfolio or financial services.
