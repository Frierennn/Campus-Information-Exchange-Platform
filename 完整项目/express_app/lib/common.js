const crypto=require('crypto')
// let obj=crypto.createHash('md5') //创建并返回一个hash对象，它是一个指定算法的加密hash，用于生成hash摘要
// let hash=obj.update('admin') //更新hash的内容为指定的data
// console.log(hash.digest('hex'))
//=========================================(2)
module.exports={
    md5:function (str){
        let hash=crypto.createHash('md5')
        hash.update(str)
        return hash.digest('hex')
    }
}
