import { APIGatewayEvent } from "aws-lambda";
import { logInfo } from "../utils/logger";
import { SQS } from "../utils/sqs";
import { UserPayload } from "./types";

module.exports.handler = async (event: APIGatewayEvent) => {
  if (!event.body) throw Error("Event has no body property");

  let response;

  const msg = JSON.parse(event.body).event;

  logInfo("Event Received", msg);

  if (!msg.type) throw Error("The event is missing a type property");

  if (msg.type === "url_verification") {
    response = {
      challenge: msg.challenge,
    };
  }

  if (["team_join", "user_change"].includes(msg.type)) {
    if (!process.env.QUEUE_URL) throw Error("QUEUE_URL is not configured");

    if (!msg.user) throw Error("The event is missing a user property");

    if (!msg.user.id) throw Error("The user is missing an id property");

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

    await queue.postMessage(process.env.QUEUE_URL, payload);

    response = {
      status: "Successfully posted the user",
      ...msg,
    };
  }

  if (response) {
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  }

  throw Error("Unknown event type");
}
