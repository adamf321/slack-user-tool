export class ConfigService {
  isOffline = (): boolean => process.env.IS_OFFLINE ? process.env.IS_OFFLINE === "true" : false;

  awsRegion = (): string => process.env.AWS_REGION || "us-east-1";

  userTable = (): string => process.env.DDB_USER || "";
}
