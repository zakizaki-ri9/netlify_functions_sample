import {
  WebClient
} from '@slack/client'

exports.handler = (event, context, callback) => {

  // Slackから通知された情報を出力
  const body = JSON.parse(event.body)
  console.log(JSON.stringify(body, null, 2))

  if (
    slackEvent &&
    slackEvent.type === 'reaction_added' &&
    slackEvent.item.type === 'message'
  ) {
    const web = new WebClient(process.env.SLACK_TOKEN)
    const res = await web.conversations.history({
      latest: slackEvent.item.ts,
      limit: 1,
      channel: slackEvent.item.channel,
      inclusive: true
    })
    const message = res.message[0]

    // slackclientで取得したメッセージを表示
    console.log(JSON.stringify(message, null, 2))
  }

  callback(null, {
    statusCode: 200,
    body: body.challenge
  })
}