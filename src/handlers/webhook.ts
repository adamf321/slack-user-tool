import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import { logInfo } from "../utils/logger";
import { SQS } from "../utils/sqs";
import { UserPayload } from "./types";

module.exports.handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  if (!event.body) return callback(Error("Event has no body property"));
  
  let response;

  const msg = JSON.parse(event.body);

  logInfo("Event Received", event.body);

  if (msg.type === "url_verification") {
    response = {
      challenge: msg.challenge,
    };
  }

  if (["team_join", "user_change"].includes(msg.type)) {
    if (!msg.user) {
      return callback(Error("The event is missing a user property"));
    }

    if (!msg.user.id) {
      return callback(Error("The user is missing an id property"));
    }

    const queue = new SQS();

    const payload: UserPayload = {
      operation: msg.type === "team_join" ? "insert" : "update",
      user: {
        id: msg.user.id,
        name: msg.user.name,
        deleted: msg.user.deleted,
        real_name: msg.user.real_name,
        tz: msg.user.tz,
        status_text: msg.user.profile.status_text,
        status_emoji: msg.user.profile.status_emoji,
        image_512: msg.user.profile.image_512,
      },
    }

    await queue.postMessage("user", payload);

    response = {
      status: "Successfully posted the user",
      ...msg,
    };
  }

  if (response) {
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(response),
    });
  }

  return callback(Error("Unknown event type"));
}
