console.log(process.env.NODE_ENV);

require('dotenv').config();
// 引入express
const express = require('express')

// 建立web server物件
const app = express()

// 路由
// 方法要對、路徑要對，才會接收
app.get('/', function (req, res) {
  res.send('Hello World')
});

// app.post('/', function (req, res) {
//   res.send('Hello World')
// })

console.log("server is on: http://localhost:3000/")

// *** 此段放在所有路由設定的後面 ***
app.use((req,res)=>{
  res.status(404).send(`<h4>走錯路了</h4>`);
})


// server偵聽，偵聽之後的callback function可寫可不寫
const port = process.env.PORT || 3001;
app.listen(port, function(){
  console.log(`server started: ${port} - `, new Date());
})