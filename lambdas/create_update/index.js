const AWS = require("aws-sdk");
const jwt_decode = require("jwt-decode");
const cryptoRandomString = require("crypto-random-string");

exports.handler = (event, context, callback) => {
  const ddb = new AWS.DynamoDB.DocumentClient();
  let boardsTable = process.env.BOARDS_TABLE;

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

  var board = JSON.parse(event.body);
  board.userId = userId;

  if (event.pathParameters && event.pathParameters.id) {
    const urlId = decodeURI(event.pathParameters.id);
    if (urlId != board.id) {
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          Error: "Path ID does not match board id",
        }),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        isBase64Encoded: false,
      });
    }
  } else {
    board.id = cryptoRandomString({ length: 10, type: 'url-safe' });
  }

  board.lastUpdated = Date.now();

  var params = {
    TableName: boardsTable,
    Item: board,
  };

  ddb.put(params, function (err, data) {
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
      if (event.pathParameters && event.pathParameters.id) {
        callback(null, {
          statusCode: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          isBase64Encoded: false,
        });
      } else {
        callback(null, {
          statusCode: 201,
          body: JSON.stringify(board.id),
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          isBase64Encoded: false,
        });
      }
      // successful response

    }
  });
};
