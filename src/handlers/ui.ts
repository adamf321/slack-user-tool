import { APIGatewayEvent, Callback, Context } from "aws-lambda";
import { UserRepo } from "../repos/user.repo";

module.exports.handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  const userRepo = new UserRepo();

  const users = await userRepo.get();

  let userTable = "";

  for (const user of users) {
    userTable += `<tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.deleted ? "Yes" : "No"}</td>
        <td>${user.real_name}</td>
        <td>${user.tz}</td>
        <td>${user.status_text}</td>
        <td>${user.status_emoji}</td>
        <td><img src="${user.image_512}" class="avatar"></td>
      </tr>`;
  }

  const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>WorkOS Slack User Tool</title>
        <style>
          table, th, td {
            border: 1px solid #9e9e9e;
            border-collapse: collapse;
            padding: 5px;
          }
          .avatar {
            max-width: 70px;
          }
        </style>
      </head>
      <body>
        <main>
          <h1>Welcome to the WorkOS Slack User Tool</h1>
          <table>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Deleted</th>
              <th>Real Name</th>
              <th>Timezone</th>
              <th>Status Text</th>
              <th>Status Emoji</th>
              <th>Avatar</th>
            </tr>
            ${userTable}
          </table>
        </main>
      </body>
    </html>`;

  return callback(null, {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: html,
  });
}
