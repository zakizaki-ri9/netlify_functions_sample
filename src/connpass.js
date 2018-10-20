import axios from 'axios'

exports.handler = async (event, context, callback) => {

  let body = event.body
  console.log(JSON.stringify(body))

  let result = null
  if (body.event_id && body.event_id.length > 0) {
    console.log("[PRD] searchExec")
    result = await searchExec(body.event_id[0])
  } else {
    console.log("[TEST] searchExec")
    result = await searchExec(103631)
  }

  console.log(result)

  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(result)
  })

  async function searchExec(id) {
    console.log("id: " + id.toString())

    let connpassUrl = "https://connpass.com/api/v1/event/?event_id=" + id.toString()
    console.log("url: " + connpassUrl)

    // connpassイベントサーチAPIを実行
    let res = await axios.get(connpassUrl)
    console.log("res.data: " + JSON.stringify(res.data))

    return res.data
  }
}