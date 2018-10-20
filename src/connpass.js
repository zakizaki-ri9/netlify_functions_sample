exports.handler = function (event, context, callback) {

  console.log("start");

  let responce = {};

  console.log(JSON.stringify(event, null, 2));

  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(responce)
  });

  console.log("end");
}