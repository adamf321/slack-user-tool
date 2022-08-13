const axios = require("axios");
const mariadb = require("mariadb");
const { SendMessageCommand, SQSClient } = require("@aws-sdk/client-sqs");

const SLACK_URL = "https://slack.com/api/users.list?limit=200"
const SLACK_TOKEN = "xoxb-3921443771269-3949371053696-pnB5Gdfv9lUzOkUZ9ZReDKBk";
const SQS_URL = "https://sqs.us-east-1.amazonaws.com/367114526435/aws-node-project-prod-user-event";
const DB_HOST = "workos.cclfxume2xkm.us-east-1.rds.amazonaws.com";
const DB_NAME = "slack";
const DB_USER = "admin";
const DB_PASSWORD = "12345678";

(async () => {
  const pool = mariadb.createPool({
    host: DB_HOST,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    connectionLimit: 1,
  });

  try {
    conn = await pool.getConnection();
    await conn.query("DELETE FROM users");
  } finally {
    pool.end();
  }

  console.log("Deleted all records from the users table");

  const sqs = new SQSClient({ region: "us-east-1" });

  const res = await axios.get(SLACK_URL, {
    headers: { Authorization: `Bearer ${SLACK_TOKEN}` }
  });

  const data = res.data;

  if (!data.ok) throw new Error("Something is up with the data");

  console.log(`Retrieved ${data.members.length} users`);

  for (user of data.members) {
    const payload = {
      operation: "insert",
      user: {
        id: user.id,
        name: user.name,
        deleted: user.deleted,
        real_name: user.real_name,
        tz: user.tz,
        status_text: user.profile.status_text,
        status_emoji: user.profile.status_emoji,
        image_512: user.profile.image_512,
      },
    };

    console.log(`Posting user ${user.id} (${user.real_name}) to queue`);

    await sqs.send(new SendMessageCommand({
      QueueUrl: SQS_URL,
      MessageBody: JSON.stringify(payload),
    }));
  }
})();
