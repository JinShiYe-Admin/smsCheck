import Vue from 'vue'
import HmacSHA1 from 'crypto-js/hmac-sha1'
import Base64 from 'crypto-js/enc-base64'

/**
 * 将发送请求时的参数，按顺序排列，并进行签名
 * @param {object} params 参数对象
 * @returns {string} 签名生成的 Base64 字符串
 */
function signHmacSHA1(params) {
  if (params && JSON.stringify(params) !== '{}') {
    const secretKey = Vue.prototype.SECRETKEY
    // 获取参数名数组，并移除值为 undefined 的参数
    const filterKeys = Object.keys(params).filter((k) => params[k] !== undefined)
    // 按字母排序参数名
    const sortedKeys = filterKeys.sort()
    // 拼接参数
    // const queryString = sortedKeys.map((k) => [k, params[k]].join('=')).join('&')
    const queryString = sortedKeys
      .map((k) =>
        [k, params[k] !== null && typeof params[k] === 'object' ? JSON.stringify(params[k]) : params[k]].join('=')
      )
      .join('&')

    return HmacSHA1(queryString, secretKey).toString(Base64)
  }
  return undefined
}

module.exports = {
	signHmacSHA1: signHmacSHA1,
}