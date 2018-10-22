import axios from 'axios'
import moment from 'moment'

/**
 * connpassのイベント情報を返却する処理
 * この処理がnetlify functionとしてデプロイされる
 * 
 * @param  {object} event ヘッダーやパラメータ
 * @param  {object} context
 * @param  {method} callback 呼び出し元に返却する関数
 * @returns {object} 
 **/
exports.handler = async (event, context, callback) => {

  try {
    // パラメータ取得
    let body = JSON.parse(event.body)
    console.log(body)

    // パラメータで渡された分のイベント情報を取得
    let returnValue = {
      "result": []
    }

    // connpassの情報を取得
    if (body.event_id && body.event_id.length > 0) {
      console.log('[PRD] searchExec')
      returnValue.result = await eventInfo(body.event_id)
    } else {
      // テスト用
      console.log('[TEST] searchExec')
      returnValue.result = await eventInfo([103631])
    }

    // 送信元へコールバック
    callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(returnValue)
    })
  } catch (e) {
    console.error(e)
    callback(null, {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/plain'
      },
      body: "please try"
    })
  }

  /**
   * connpassイベントサーチAPIを実行、必要な情報を返却する処理
   * 
   * @param  {Array<int>} idArray イベントIDの配列
   * @returns {object} 
   **/
  async function eventInfo(idArray) {
    // URL生成
    let connpassUrl = 'https://connpass.com/api/v1/event/?event_id=' + (idArray.length > 1 ? idArray.join(',') : idArray[0].toString())
    console.log('url: ' + connpassUrl)

    // connpassイベントサーチAPIを実行
    let res = await axios.get(connpassUrl)
    console.log('res.data: ' + JSON.stringify(res.data))

    // 取得できたイベントの必要な情報のみを取得
    let result = []
    if (res.data.events && res.data.events.length > 0) {
      res.data.events.forEach(function (event) {
        result.push({
          "event_url": event.event_url,
          "title": event.title,
          "address": event.address,
          "place": event.place,
          "limit": event.limit,
          "accepted": event.accepted,
          "started_date_at": moment(event.started_at).format("YYYY-MM-DD"),
          "started_time_at": moment(event.started_at).format("hh:mm:ss"),
          "ended_date_at": moment(event.ended_at).format("YYYY-MM-DD"),
          "ended_time_at": moment(event.ended_at).format("hh:mm:ss")
        })
      })
    }
    return result
  }
}