import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import jwt_decode from "jwt-decode";
import cryptoRandomString from "crypto-random-string";

export const handler = async (event) => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);
  let boardsTable = process.env.BOARDS_TABLE;

  let userId = "";
  if (event.queryStringParameters && event.queryStringParameters["shareCode"]) {
    userId = atob(event.queryStringParameters["shareCode"]);
  } else if (event?.headers?.Authorization) {
    var decoded = jwt_decode(event.headers.Authorization);
    userId = decoded["cognito:username"];
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({
        Error: "No Auth or share code found",
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      isBase64Encoded: false,
    };
  }

  var board = JSON.parse(event.body);
  board.userId = userId;

  var params = {
    TableName: boardsTable,
  };

  if (event.pathParameters && event.pathParameters.id) {
    const urlId = decodeURI(event.pathParameters.id);
    if (urlId != board.id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          Error: "Path ID does not match board id",
        }),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        isBase64Encoded: false,
      };
    }

    const prevLastUpdated = board.lastUpdated;
    params = {
      ...params,
      ExpressionAttributeValues: {
        ":lastUpdated": prevLastUpdated,
      },
      ConditionExpression: "lastUpdated = :lastUpdated",
    };
  } else {
    board.id = cryptoRandomString({ length: 10, type: "url-safe" });
    board.createdDate = Date.now();
  }

  board.lastUpdated = Date.now();
  params = { ...params, Item: board };

  const command = new PutCommand(params);
  try {
    await docClient.send(command);
    if (event.pathParameters && event.pathParameters.id) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          lastUpdated: board.lastUpdated,
        }),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        isBase64Encoded: false,
      };
    } else {
      return {
        statusCode: 201,
        body: JSON.stringify({
          id: `${board.id}`,
          lastUpdated: board.lastUpdated,
        }),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        isBase64Encoded: false,
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        Error: error.message,
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      isBase64Encoded: false,
    };
  }
};
