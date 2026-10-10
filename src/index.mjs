import { createAssistApplication } from "@red-cup-engineering/assist/application";
import { assistAppRecords, assistConditions } from "@red-cup-engineering/assist/records";

const application = createAssistApplication({ records: assistAppRecords, conditions: assistConditions });

export default { fetch: (request, env) => application.fetch(request, { capabilities: { env } }) };
