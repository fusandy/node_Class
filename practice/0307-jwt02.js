// 0307 json web token
// 檢查token是否合法

const jwt = require('jsonwebtoken');
const key = 'fghjkmnbvcdrtyuikmnh';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOjEsImFjY291bnQiOiJBUFBMRSIsImlhdCI6MTY0NjYzOTczMn0.H0xDqiPjQxVT5hC6t5vOWAaGiVk2aMohSL-DeiTUCgc'

let oriData;
try{
    oriData = jwt.verify(token,key);
}catch(ex){
    console.log(ex);
}
console.log(oriData)