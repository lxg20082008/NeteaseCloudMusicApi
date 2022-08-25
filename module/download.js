// 下载mp3

const fs = require('fs')
const axios = require('axios')
const filenamify = require('filenamify')

const downloadFile2 = async (url, targetFile) => {
  console.log('begin file downloaded', url, targetFile)
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
    })
    // console.log(response, response.code)
    const file = filenamify(targetFile)
    const pf = response.data.pipe(fs.createWriteStream(file))
    pf.on('finish', () => {
      console.log('file downloaded successfully :)', url, file)
    })
  } catch (error) {
    throw new Error(error)
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
