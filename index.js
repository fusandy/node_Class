console.log(process.env.NODE_ENV);

require('dotenv').config();
// 引入express
const express = require('express');
const { acceptsLanguages } = require('express/lib/request');

// 建立web server物件
const app = express();

// 主程式設定註冊樣板引擎
app.set('view engine', 'ejs');

// Top Level Middleware
// 判斷是否為urlencoded，是才處理，不是就跳過
app.use(express.urlencoded({extended:false}));
// 判斷是否為json，是才處理，不是就跳過
app.use(express.json());
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

// 取得JSON資料
// 如果require是json檔，可以不用寫副檔名，js檔也是
// require要寫相對路徑
// app.get('/json-sales', function (req, res) {
//   const sales = require('./data/sales.json')  // require進來，自動json.parse轉變為陣列
//   console.log(sales);
//   // res.send(sales[0].name);
//   // res.send('200');
//   res.render('json-sales', {sales});
// });


// TODO: 陣列排序
app.get('/json-sales', (req,res)=>{
  const sales = require('./data/sales.json')
  // 排序之前先接收值
  // req.query.orderByCol = age
  // req.query.orderByRule = desc
  console.log(req.query);
  const col = req.query.orderByCol;
  const rule = req.query.orderByRule
  console.log(col)
  console.log(rule);
  // 再傳送資料
  // 先過濾
  if (col==='age'&& rule==='asc'){
    sales.sort(function(a,b){
        return a[col] - b[col];
    })
  } else if (col==='age'&& rule==='desc'){
    sales.sort(function(a,b){
      return (a[col] - b[col])*-1;
    })
  }


  
  console.log(sales);
  res.render('json-sales', {sales});
  
})
  


// 取得queryString資料
app.get('/get-qs', function(req, res){
  res.json(req.query);
});


// 取得POST資料
// middleware移到最前面Top level
// const urlencodedParser = express.urlencoded({extended:false});
app.post('/try-post',(req,res)=>{
  res.json(req.body);
})


app.get('/try-post-form',(req,res)=>{
  res.render('try-post-form');
})
app.post('/try-post-form',(req,res)=>{
  res.render('try-post-form', req.body);
})


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