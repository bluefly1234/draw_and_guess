import fs from 'fs'
import path from 'path'

// 获得一个乱序数组
function getRandomArray(array) {
  if (array) {
    return array.sort((a, b) => {
      return Math.random() > 0.5 ? 1 : -1
    })
  }
  return array
}

// 项目根路径
const projectRoot = path.resolve(__dirname, '../')
// 同步读取题目文件和昵称文件，由于是本地静态文件所以可以用同步，如果从数据库中获取最好是用异步方法
const wordData = fs.readFileSync(projectRoot + '/word.txt','utf-8') // 题目文件
const nickNameData = fs.readFileSync(projectRoot + '/nickname.txt', 'utf-8') // 昵称文件

const allWord = wordData.split('\n')
const allNameArray = nickNameData.split('\n')

let keyIndex = 0
let nameIndex = 0

// 保温杯:日用品
let allKeys = allWord.map(item => {
  return item.split(':')
})

let allNames = getRandomArray(allNameArray)
allKeys = getRandomArray(allKeys)


console.log('projectRoot:', projectRoot)
console.log('allGameKeyLength: ', allKeys.length)
console.log('allNameLength: ', allNames.length)

export default {
  getNextKey () {
    let keyWord = allKeys[keyIndex++]
    if (!keyWord) {
      allKeys = getRandomArray(allKeys)
      keyIndex = 0
      keyWord = allKeys[keyIndex++]
    }
    return keyWord
  },
  getNextName () {
    let keyWord = allNames[nameIndex++]
    if (!keyWord) {
      allNames = getRandomArray(allNames)
      nameIndex = 0
      keyWord = allNames[nameIndex++]
    }
    return keyWord
  }
}
