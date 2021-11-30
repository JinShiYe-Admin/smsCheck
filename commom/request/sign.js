import {signHmacSHA1} from './signHmacSHA1.js'

/**
 * 添加参数前面
 * @param {object} params
 * @returns {object} params with sign
 */
function addSign(params) {
  return {
    ...params,
    sign: signHmacSHA1(params)
  }
}
module.exports = {
	addSign: addSign,
}