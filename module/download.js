// 下载mp3

const fs = require('fs')
const path = require('path')
const axios = require('axios')
const config = require('../util/config')
const filenamify = require('../util/filenamify')

const downloadFile2 = async (url, targetFile) => {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
    })
    // console.log(response, response.code)
    const file = filenamify(targetFile)
    const p = path.join(config.downloadDir, file)
    console.log('begin file downloaded', url, p)
    fs.mkdirSync(path.dirname(p), { recursive: true })
    const pf = response.data.pipe(fs.createWriteStream(p))
    pf.on('finish', () => {
      console.log('file downloaded successfully :)', url, file)
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = async (query, request) => {
  await downloadFile2(query.url, query.file)
  return {
    status: 200,
    body: {
      code: '0',
    },
  }
}
