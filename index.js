console.log(process.env.NODE_ENV);

require('dotenv').config();
// 引入express
const express = require('express');

// 建立web server物件
const app = express();

// 主程式設定註冊樣板引擎
app.set('view engine', 'ejs');

// 啟動路徑是專案資料夾，所以直接打public就可以找到該資料夾，引用靜態內容的順序要放在上面
app.use(express.static('public'));

// app.get('/a.html', function (req, res) {
//   res.send(`<h2>動態內容</h2><p>${Math.random()}</p>`)
// });

// 路由
// 方法要對、路徑要對，才會接收
app.get('/', function (req, res) {

  // res.send('<h1>Hello World</h1>');
  res.render('home', {name:'Hello World'});
});

// 如果require是json檔，可以不用寫副檔名，js檔也是
// require要寫相對路徑
app.get('/json-sales', function (req, res) {
  const sales = require('./data/sales.json')  // require進來，自動json.parse轉變為陣列
  // TODO: 陣列排序
  console.log(sales);
  // res.send(sales[0].name);
  // res.send('200');
  res.render('json-sales', {sales});
});


// *** 此段放在所有路由設定的後面 ***
// use : 接收所有的方法
app.use((req,res)=>{
  res.type('text/html');
  res.status(404);
  res.send(`<h1>找不到網頁</h1>`);
})

// server偵聽，偵聽之後的callback function可寫可不寫
const port = process.env.PORT || 3001;
app.listen(port, function(){
  console.log(`server started: ${port} - `, new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}));
})