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
}
