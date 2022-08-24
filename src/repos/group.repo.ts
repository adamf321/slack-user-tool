import { MariaDB } from "../utils/mariadb";

export type Group = {
  id: number;
  group_version_id: number;
};

export class GroupRepo {
  insert = async (groupVersionId: number) => {
    const db = new MariaDB();
    return db.insert("groups", { group_version_id: groupVersionId });
  }

  insertUserGroup = async (groupId: number, userId: string) => {
    const db = new MariaDB();
    return db.insert("user_group", {
      group_id: groupId,
      user_id: userId,
    });
  }
}
