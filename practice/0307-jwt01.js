// 0307 json web token

const jwt = require('jsonwebtoken');
let token = jwt.sign({greeting:'Hello'},'xyz')

console.log(token) 

// 解碼
// verify(第一個參數是加密的token, 第二個參數是加密的key)
// 要有key才能解密
let decoded = jwt.verify(token,'xyz')

console.log(decoded)