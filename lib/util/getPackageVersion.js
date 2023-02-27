/*
 * @Author: wj
 * @Date: 2020-07-23 10:50:02
 * @LastEditors: wj_advance
 * @LastEditTime: 2022-12-08 17:14:55
 * @FilePath: /tm-create-cli/lib/util/getPackageVersion.js
 * @Description: 获取最新版本并且缓存在磁盘本地以便下次使用
 */
const request = require('./request.js')
module.exports = async function getPackageVersion(id, range = '') {
  // const registry = (await require('./shouldUseTaobao')())
  //   ? `https://registry.npm.taobao.org`
  //   : `https://registry.npmjs.org`;
  const registry = `https://registry.npm.taobao.org` // TODO区分淘宝源与npm源
  let result
  try {
    result = await request.get(
      // 关于npm对package的定义 https://docs.npmjs.com/about-packages-and-modules
      `${registry}/${encodeURIComponent(id).replace(/^%40/, '@')}/${range}`
    )
  } catch (err) {
    return err
  }
  return result
}
