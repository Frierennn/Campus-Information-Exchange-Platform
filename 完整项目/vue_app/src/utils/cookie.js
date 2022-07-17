/**
 * @description 保存cookie
 * @param {Object} json 需要存储cookie的对象
 * @param {Number} days 默认存储多少天
 */
function setCookie(json, days) {
    // 设置过期时间
    let data = new Date(
        new Date().getTime() + days * 24 * 60 * 60 * 1000
    ).toUTCString();

    for (let key in json) {
        document.cookie = key + "=" + json[key] + "; expires=" + data;
    }
}
/**
 * @description 获取cookie
 * @param {String} name 需要获取cookie的key
 */
function getCookie(name) {
    let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    // "(^| )"+name 的含义 : 匹配以空格开头 或者 空白name 开头的字符串
    // ([^;]*) 匹配任意数量的 除了 ; 以外的字符  分组
    // (;|$) 匹配任何以 ; 结尾 或者 以空白结尾的参数
    // ([^;]*)(;|$)的含义 : 匹配 ; 之外的以任意多个 参数值,一旦遇到 ; 或者 空白 就中止
    if (arr != null) {
        return unescape(arr[2]) //unescape() 函数可对通过 escape() 编码的字符串进行解码。
    } else {
        return null
    }
}
/**
 * @description 删除cookie
 * @param {String} name 需要删除cookie的key
 */
function clearCookie(name) {
    let json = {};
    json[name] = '';
    setCookie(json, -1)
}
export default {
    setCookie,
    getCookie,
    clearCookie
}