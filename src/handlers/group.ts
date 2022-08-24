import { APIGatewayEvent } from "aws-lambda";
import { GroupRepo } from "../repos/group.repo";
import { User, UserRepo } from "../repos/user.repo";
import { shuffleArray } from "../utils/array";
import { logInfo } from "../utils/logger";
import { generateRandomNumber } from "../utils/number";

module.exports.handler = async (event: APIGatewayEvent) => {
  if (!event.body) throw Error("Request has no body property");

  const body = JSON.parse(event.body);

  logInfo("Body Received", body);

  const groupSize = body.group_size;

  if (!groupSize || !Number.isInteger(groupSize) || groupSize < 2) {
    throw Error("The request is missing a group_size property, which must be an integer of 2 or more");
  }

  const userRepo = new UserRepo();

  const users = await userRepo.get();

  shuffleArray(users);

  let groups: Array<Array<User>> = [];

  for (const user of users) {
    let currentGroup = groups[groups.length - 1];

    if (!currentGroup || currentGroup.length >= groupSize) {
      currentGroup = [];
      groups.push(currentGroup);
    }

    currentGroup.push(user);
  }

  const lastGroup = groups[groups.length - 1];

  if (lastGroup.length < groupSize && groups.length > 1) {
    let penultimateGroup = groups[groups.length - 2];
    penultimateGroup = [...penultimateGroup, ...lastGroup];
    groups[groups.length - 2] = penultimateGroup;
    groups.pop();
  }

  const groupVersionId = generateRandomNumber(1000000);

  logInfo(`Generated ${groups.length} groups. Group version id is ${groupVersionId}`);

  const groupRepo = new GroupRepo();
  let response = {}

  for (const group of groups) {
    const res = await groupRepo.insert(groupVersionId);
    const groupId = Number(res.insertId);
    response[groupId] = [];

    for (const user of group) {
      await groupRepo.insertUserGroup(groupId, user.id);
      response[groupId].push(user.id);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
}
