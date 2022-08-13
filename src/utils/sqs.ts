import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { ConfigService, Queues } from "./config.service";
import { logInfo } from "./logger";

export class SQS {
  postMessage = async (queue: Queues, message: any) => {
    const config = new ConfigService();

    if (config.isOffline()) {
      logInfo(`We are offline. If we were online we would have posted the following to the ${queue} queue`, message);
      return;
    }

    const sqs = new SQSClient({ region: config.awsRegion() });

    logInfo(`Posting to the ${queue} queue`, message);

    await sqs.send(new SendMessageCommand({
      QueueUrl: config.queueUrl(queue),
      MessageBody: JSON.stringify(message),
    }));
  }
}
