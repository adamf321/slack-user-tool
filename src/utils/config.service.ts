export type Queues = "user";

export class ConfigService {
  isOffline = (): boolean => process.env.IS_OFFLINE ? process.env.IS_OFFLINE === "true" : false;

  awsRegion = (): string => process.env.AWS_REGION || "us-east-1";

  queueUrl = (queueName: Queues): string => process.env[`SQS_URL_${queueName}`] ?? "";
}
