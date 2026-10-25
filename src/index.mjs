import { createAssistApplication } from "@red-cup-engineering/assist/application";
import { boundAssistRecordSet } from "@red-cup-engineering/assist/records";

let previousBinding;
let previousApex;
let previousHostMode;
let previousApplication;

function applicationFor(binding, apex, hostMode) {
  if (typeof binding === "string" && binding === previousBinding &&
      apex === previousApex && hostMode === previousHostMode) return previousApplication;
  const { records, conditions } = boundAssistRecordSet(binding);
  const application = createAssistApplication({ records, conditions, apex, hostMode });
  if (typeof binding === "string") {
    previousBinding = binding;
    previousApex = apex;
    previousHostMode = hostMode;
    previousApplication = application;
  }
  return application;
}

const unavailable = () => Response.json({ type: "about:blank", title: "ASSIST instance is not configured", status: 503 },
  { status: 503, headers: { "content-type": "application/problem+json", "cache-control": "no-store" } });

/** The deployment binds one immutable source roster. This avoids a large Cloudflare
 * variable and introduces no second application, route parser or response rewrite. */
export function createAssistWorker({ roster, apex, hostMode } = {}) {
  const binding = typeof roster === "string" ? roster : JSON.stringify(roster);
  const application = applicationFor(binding, apex, hostMode);
  return Object.freeze({ fetch: request => application.fetch(request) });
}

/** Small roster bindings remain supported for existing hosts. Larger source
 * instances use createAssistWorker through the original build entry. */
export default {
  fetch(request, env) {
    let application;
    try {
      application = applicationFor(env?.ASSIST_ROSTER, env?.ASSIST_APEX, env?.ASSIST_HOST_MODE);
    } catch (error) {
      if (!(error instanceof TypeError) && !(error instanceof SyntaxError)) throw error;
      return unavailable();
    }
    return application.fetch(request);
  },
};
