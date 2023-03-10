const AWS = require("aws-sdk");
const jwt_decode = require("jwt-decode");

exports.handler = function (event, context, callback) {
  const ddb = new AWS.DynamoDB.DocumentClient();
  let boardsTable = process.env.BOARDS_TABLE;

  let userId = '';
  if (event.queryStringParameters && event.queryStringParameters['shareCode']) {
    userId = atob(event.queryStringParameters['shareCode']);
  } else if (event?.headers?.Authorization) {
    var decoded = jwt_decode(event.headers.Authorization);
    userId = decoded["cognito:username"];
  } else {
    callback(null, {
      statusCode: 401,
      body: JSON.stringify({
        Error: "No Auth or share code found",
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      isBase64Encoded: false,
    });
  }

  var params = {
    ExpressionAttributeValues: {
      ":userId": userId,
    },
    KeyConditionExpression: "userId = :userId",
    ProjectionExpression: "userId, id, title, crosswordDate, createdDate, lastUpdated",
    TableName: boardsTable,
  };

  ddb.query(params, function (err, data) {
    if (err) {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          Error: err.message,
        }),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        isBase64Encoded: false,
      });
    } else {
      // successful response
      console.log(data);
      callback(null, {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(data.Items),
        isBase64Encoded: false,
      });
    }
  });
};
