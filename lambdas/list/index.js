import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import jwt_decode from "jwt-decode";

export const handler = async (event) => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);
  let boardsTable = process.env.BOARDS_TABLE;

  let userId = '';
  if (event.queryStringParameters && event.queryStringParameters['shareCode']) {
    userId = atob(event.queryStringParameters['shareCode']);
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

  var params = {
    ExpressionAttributeValues: {
      ":userId": userId,
    },
    KeyConditionExpression: "userId = :userId",
    ProjectionExpression: "userId, id, title, crosswordDate, createdDate, lastUpdated",
    TableName: boardsTable,
  };

  const command = new QueryCommand(params);
  try {
    const data = await docClient.send(command);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data.Items),
      isBase64Encoded: false,
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
