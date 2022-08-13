import { MariaDB } from "../utils/mariadb";

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
  insert = async (user: User) => {
    const db = new MariaDB();
    return db.insert("users", user);
  }

  update = async (user: User) => {
    const db = new MariaDB();
    
    const { id, ...newData } = user;

    return db.update("users", id, newData as { [key: string]: boolean | string | number });
  }

  get = async (): Promise<User[]> => {
    const db = new MariaDB();
    return (await db.get("users")) as User[];
  }
}
