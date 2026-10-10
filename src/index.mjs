import { createAssistApplication } from "@red-cup-engineering/assist/application";
import { assistAppRecords } from "@red-cup-engineering/assist/records";

const application = createAssistApplication({ records: assistAppRecords });

export default { fetch: (request, env) => application.fetch(request, { capabilities: { env } }) };
