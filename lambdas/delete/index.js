const AWS = require("aws-sdk");
const jwt_decode = require("jwt-decode");

exports.handler = function (event, context, callback) {
  const ddb = new AWS.DynamoDB.DocumentClient();
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

  ddb.delete(params, function (err, data) {
    if (err) {
      // an error occurred
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
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        isBase64Encoded: false,
      });
    }
  });
};
