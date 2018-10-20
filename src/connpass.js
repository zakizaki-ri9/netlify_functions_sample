exports.handler = function (event, context, callback) {

  let responce = {};

  console.log(event.body);

  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(responce)
  });
}