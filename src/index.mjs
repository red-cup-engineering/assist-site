import { createAssistApplication } from "@red-cup-engineering/assist/application";
import { boundAssistRecordSet } from "@red-cup-engineering/assist/records";

// A Worker binding is immutable text for one deployed version. Reuse its admitted
// application; object bindings remain uncached so later host edits are rechecked.
let previousBinding;
let previousApplication;

function applicationFor(binding) {
  if (typeof binding === "string" && binding === previousBinding) return previousApplication;
  const { records, conditions } = boundAssistRecordSet(binding);
  const application = createAssistApplication({ records, conditions });
  if (typeof binding === "string") {
    previousBinding = binding;
    previousApplication = application;
  }
  return application;
}

export default {
  fetch(request, env) {
    let application;
    try {
      application = applicationFor(env?.ASSIST_ROSTER);
    } catch (error) {
      if (!(error instanceof TypeError) && !(error instanceof SyntaxError)) throw error;
      return Response.json({ type: "about:blank", title: "ASSIST instance is not configured", status: 503 },
        { status: 503, headers: { "content-type": "application/problem+json", "cache-control": "no-store" } });
    }
    return application.fetch(request);
  },
};
