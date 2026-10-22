import { createAssistApplication } from "@red-cup-engineering/assist/application";
import { boundAssistRecordSet } from "@red-cup-engineering/assist/records";

// The deploying instance supplies its roster and condition witnesses explicitly.
// Missing or invalid authority is refused before constructing the application.
export default {
  fetch(request, env) {
    const { records, conditions } = boundAssistRecordSet(env?.ASSIST_ROSTER);
    const application = createAssistApplication({ records, conditions });
    return application.fetch(request, { capabilities: { env } });
  },
};
