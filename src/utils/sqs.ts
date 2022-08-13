import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { ConfigService } from "./config.service";
import { logInfo } from "./logger";

export class SQS {
  postMessage = async (queueUrl: string, message: any) => {
    const config = new ConfigService();

    if (config.isOffline()) {
      logInfo(`We are offline. If we were online we would have posted the following to the ${queueUrl} queue`, message);
      return;
    }

    const sqs = new SQSClient({ region: config.awsRegion() });

    logInfo(`Posting to the ${queueUrl} queue`, message);

    await sqs.send(new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(message),
    }));
  }
}
