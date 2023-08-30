const fs = require('fs');
const path = require('path');
const XiaoAi = require('xiaoai-tts')
const config = require('../util/config.json')

const sessionFilePath = path.join('session');

async function main() {
  let client = null;

  try {
    // 尝试读取本地 Session 信息
    const session = fs.readFileSync(sessionFilePath, { encoding: 'utf8' });

    // 通过 Session 登录
    client = new XiaoAi(JSON.parse(session));
  } catch (e) {
    client = new XiaoAi(config.xiaomi_user, config.xiaomi_pwd);

    const session = await client.connect();

    // 将 Session 储存到本地
    fs.writeFileSync(sessionFilePath, JSON.stringify(session));
  }
  // 在这里继续执行后续操作
  await client.say('你好，我是小爱')
}

module.exports = async (query, request) => {
  await main().catch(console.error);
  return {
    status: 200,
    body: {
      code: '0',
    },
  }
}
