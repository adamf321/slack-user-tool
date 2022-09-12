import { DynamoDBClient, PutItemCommand, ExecuteStatementCommand, ExecuteStatementCommandOutput, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { ConfigService } from "./config.service";

export class DynamoDB {
  private _client = (): DynamoDBClient => {
    const configService = new ConfigService();

    return new DynamoDBClient({ region: configService.awsRegion() });
  }

  insert = async (table: string, data: { [key: string]: boolean | string | number | null }) => {
    return this._client().send(new PutItemCommand({
      TableName: table,
      Item: marshall(data, { removeUndefinedValues: true }),
    }));
  }

  update = async (table: string, id: string, data: { [key: string]: boolean | string | number | null }) => {
    const sets = Object.keys(data).reduce((p: string, c: string) => `${p} SET "${c}"=?`, "");

    const res: ExecuteStatementCommandOutput = await this._client().send(new ExecuteStatementCommand({
      Statement: `UPDATE "${table}"${sets} WHERE "id"='${id}'`,
      Parameters: Object.values(marshall(data))
    }));

    if (!res?.Items) {
      return null;
    }

    if (!res?.Items?.length) {
      return [];
    }

    return res.Items.map(i => unmarshall(i));
  }

  get = async (table: string) => {
    const data = await this._client().send(new ScanCommand({
      TableName: table,
    }));

    if (!data.Items) return [];

    return data.Items.map(i => unmarshall(i));
  }
}
