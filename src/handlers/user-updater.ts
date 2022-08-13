import { Callback, Context, SQSEvent } from "aws-lambda";
import { UserRepo } from "../repos/user.repo";
import { logInfo } from "../utils/logger";
import { UserPayload } from "./types";

module.exports.handler = async (event: SQSEvent, context: Context, callback: Callback) => {
  const userRepo = new UserRepo();

  logInfo("Event Received", event);

  for (const record of event.Records) {
    const payload: UserPayload = typeof record.body === "string" ? JSON.parse(record.body) : record.body;
    
    if (payload.operation === "insert") {
      try {
        await userRepo.insert(payload.user);
      } catch (e) {
        if (e.code === "ER_DUP_ENTRY") {
          return callback(null, {
            statusCode: 200,
            body: JSON.stringify({
              message: "A record with this id already exists, ignoring this attempt to insert it again",
            }),
          });
        }
        throw e;
      }
      
      continue;
    }

    if (payload.operation === "update") {
      await userRepo.update(payload.user);
      continue;
    }

    return callback(Error("Unknown operation"));
  }
  
  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: "Success",
    }),
  });
}