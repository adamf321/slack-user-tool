import { User } from "../repos/user.repo";

export type UserPayload = {
  operation: "insert" | "update";
  user: User;
}
