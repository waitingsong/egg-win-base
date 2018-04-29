/**
 * 搜索指定目录以 file.example 文件为基础生成不带后缀的文件为不带 .example 后缀的文件
 */

import { copyFileAsync, isPathAcessible, join, readDirAsync, readFileAsync, writeFileAsync } from '../app/shared/index'

import folderArr from './init.config'

const rootDir = join(__dirname, '..')
const copyed = <string[]> []

async function genExampleFiles(list: string[]) {
  for (const dir of list) {
    const path = join(rootDir, dir.replace(/\.{2,}/, '/'))

    if (! await isPathAcessible(path)) {
      continue
    }
    const files = await readDirAsync(path)

    for (const file of files) {
      if (!hasExampleSuffix(file)) {
        continue
      }
      const source = join(path, file)
      const stripped = stripExampleSuffix(file)
      const target = join(path, stripped)

      if (! await isPathAcessible(target)) {
        await copyFileAsync(source, target)
        copyed.push(`${dir}/${stripped}`)
      }
    }
  }
}

function hasExampleSuffix(name: string): boolean {
  if (!name) {
    return false
  }
  if (name === '.example') {
    return false
  }
  const arr = name.split('.')

  if (arr.length > 1 && arr[arr.length - 1] === 'example') {  // 排除  '.example'
    return true
  }
  else {
    return false
  }
}

function stripExampleSuffix(name: string): string {
  const arr = name.split('.')

  if (arr.length > 1 && arr[arr.length - 1] === 'example') {
    return arr.slice(0, arr.length - 1).join('.')
  }
  return name
}

async function genConfigKey(): Promise<void> {
  const js = `${rootDir}/config/config.default.js`
  const ts = `${rootDir}/config/config.default.ts`

  if (await isPathAcessible(js)) {
    throw new Error(`"${js}" 文件已存在，放弃生成 config.key 值`)
  }
  if (! await isPathAcessible(ts)) {
    throw new Error(`"${ts}" 文件不存在，放弃生成 config.key 值`)
  }

  const random = Math.random() + ''
  let content = await readFileAsync(ts, 'utf8')

  content = content.replace('1234567890', random)
  await writeFileAsync(ts, content, { encoding: 'utf8' })
  console.info(`生成 config.key 随机值: "${random}": ${ts}`)
}

genExampleFiles(folderArr)
  .then(() => {
    console.info('生成文件:：', copyed)
    return genConfigKey()
  })
  .catch(console.error)
