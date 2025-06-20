import { Client as WorkFlowClient } from "@upstash/workflow";
import { Client } from "@upstash/qstash";
import config from "@/lib/config";

export const workflowClient = new WorkFlowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

const client = new Client({ token: config.env.upstash.qstashToken });

export const sendEmail = async ({ email, subject, message }: { email: string; subject: string; message: string }) => {
  await client.publishJSON({
    url: `${config.env.apiEndpoint}/api/send-email`,
    body: {
      from: "Permpus <hello.permpus.com>",
      to: [email],
      subject,
      html: message,
    },
  });
};
