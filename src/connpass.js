import axios from 'axios'

/**
 * @param  {object} event ヘッダーやパラメータ
 * @param  {object} context
 * @param  {method} callback 呼び出し元に返却する関数
 * @returns {object} 
 */
exports.handler = async (event, context, callback) => {
  // パラメータ出力
  let body = event.body
  console.log(JSON.stringify(body))

  // パラメータで渡された分のイベント情報を取得
  let result = []
  if (body.event_id && body.event_id.length > 0) {
    console.log('[PRD] searchExec')
    for (let i = 0; i < body.event_id.length; i++) {
      result.push(await eventInfo(body.event_id[i]))
    }
  } else {
    // テスト用
    console.log('[TEST] searchExec')
    result.push(await eventInfo(103631))
  }

  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(result)
  })

  async function eventInfo(id) {
    // パラメータのイベントID
    console.log('id: ' + id.toString())

    // URL生成
    let connpassUrl =
      'https://connpass.com/api/v1/event/?event_id=' + id.toString()
    console.log('url: ' + connpassUrl)

    // connpassイベントサーチAPIを実行
    let res = await axios.get(connpassUrl)
    console.log('res.data: ' + JSON.stringify(res.data))

    // 必要なオブジェクトのみ取得
    let result = {}
    if (res.data.events && res.data.events.length > 0) {
      let event = res.data.events[0]
      result = {
        "event_url": event.event_url,
        "title": event.title,
        "address": event.address,
        "place": event.place,
        "limit": event.limit,
        "accepted": event.accepted
      }
    }
    return result
  }
}