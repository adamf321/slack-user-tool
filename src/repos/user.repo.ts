import { ConfigService } from "../utils/config.service";
import { DynamoDB } from "../utils/dynamodb";

export type User = {
  id: string;
  name?: string;
  deleted?: boolean;
  real_name?: string;
  tz?: string;
  status_text?: string;
  status_emoji?: string;
  image_512?: string;
};

export class UserRepo {
  private userTable = (new ConfigService()).userTable();

  insert = async (user: User) => {
    const db = new DynamoDB();
    return db.insert(this.userTable, user);
  }

  update = async (user: User) => {
    const db = new DynamoDB();
    
    const { id, ...newData } = user;

    return db.update(this.userTable, id, newData as { [key: string]: boolean | string | number });
  }

  get = async (): Promise<User[]> => {
    const db = new DynamoDB();
    return (await db.get(this.userTable)) as User[];
  }
}
