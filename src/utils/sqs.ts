import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { ConfigService, Queues } from "./config.service";

export class SQS {
  postMessage = async (queue: Queues, message: any) => {
    const config = new ConfigService();

    if (config.isOffline()) {
      console.log(`We are offline. If we were online we would have posted the following to the ${queue} queue:\n${JSON.stringify(message, null, 2)}`);
      return;
    }

    const sqs = new SQSClient({ region: config.awsRegion() });

    console.log(`Posting to the ${queue} queue:\n${JSON.stringify(message, null, 2)}`);

    await sqs.send(new SendMessageCommand({
      QueueUrl: config.queueUrl(queue),
      MessageBody: JSON.stringify(message),
    }));
  }
}
