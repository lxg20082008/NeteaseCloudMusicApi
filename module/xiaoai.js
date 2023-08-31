const fs = require('fs')
const path = require('path')
const XiaoAi = require('xiaoai-tts')

const sessionFilePath = path.join('session')

async function play(url, say) {
  let client = null

  try {
    // 尝试读取本地 Session 信息
    const session = fs.readFileSync(sessionFilePath, { encoding: 'utf8' })

    // 通过 Session 登录
    client = new XiaoAi(JSON.parse(session))
  } catch (e) {
    client = new XiaoAi(process.env.XIAOMI_USER, process.env.XIAOMI_PWD)

    const session = await client.connect()

    // 将 Session 储存到本地
    fs.writeFileSync(sessionFilePath, JSON.stringify(session))
  }
  // 在这里继续执行后续操作
  if (url) {
    await client.playUrl(url)
  } else {
    await client.say(say)
  }
}

module.exports = async (query, request) => {
  await play(query.url, query.say).catch(console.error)
  return {
    status: 200,
    body: {
      code: '0',
    },
  }
}
