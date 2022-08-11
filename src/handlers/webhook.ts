import { SQS } from "../utils/sqs";

module.exports.handler = async (event, context, callback) => {
  let response;

  const msg = JSON.parse(event.body);

  console.log("Event Received\n" + JSON.stringify(msg, null, 2));

  if (msg.type === "url_verification") {
    response = {
      challenge: msg.challenge,
    };
  }

  if (["team_join", "user_change"].includes(msg.type)) {
    if (!msg.user) {
      return callback(Error("The event is missing a user property"));
    }

    const queue = new SQS();

    await queue.postMessage("user", msg.user);

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
