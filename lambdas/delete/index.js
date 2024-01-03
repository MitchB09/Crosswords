import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import jwt_decode from "jwt-decode";

export const handler = async (event) => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);
  let boardsTable = process.env.BOARDS_TABLE;

  var decoded = jwt_decode(event.headers.Authorization);
  const userId = decoded["cognito:username"];

  var params = {
    TableName: boardsTable,
    Key: {
      userId: userId,
      id: decodeURI(event.pathParameters.id),
    },
  };

  const command = new DeleteCommand(params);
  try {
    const data = await docClient.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
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
    }
  }
};
