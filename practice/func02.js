// module匯入，兩種寫法
// require時， .js .json 這兩種副檔名可以不需要寫副檔名
const f1 = require('./func01');
// const f1 = require(__dirname + './func01');

//呼叫
console.log('func02:',f1(8));