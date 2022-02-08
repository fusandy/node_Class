console.log(process.env.NODE_ENV);

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const req = require('express/lib/request');
const fs = require('fs').promises;
const moment = require('moment-timezone');
const db = require('./modules/connect-db');
const sessionStore = new MysqlStore({},db);

// 引入 multer
const multer = require('multer');
// dest : 目的地，執行是在根目錄
// const upload = multer({ dest: 'tmp_uploads/' })
// 引入upload-img模組
const upload = require(__dirname+'/modules/upload-imgs')

// 建立web server物件
const app = express();

// 主程式設定註冊樣板引擎
app.set('view engine', 'ejs');

// Top Level Middleware
// 判斷是否為urlencoded，是才處理，不是就跳過
app.use(express.urlencoded({extended:false}));

// 判斷是否為json，是才處理，不是就跳過
app.use(express.json());

// 引入靜態內容的資料夾檔案(server不會再去修改的內容稱之為靜態內容)
app.use(express.static('public'));

// 呼叫session
app.use(session({
  // 硬性規定須設定以下參數
  saveUninitialized: false,
  resave: false,
  secret: 'rtyuigbhnjmklmnbvcxsertyu', //加密用的字串，隨便打即可，但長度可以長一點
  store: sessionStore,
  cookie: { 
    // cookie，可不設定
    maxAge: 1200000, 
  } 
  
}))

// 自訂頂層的middleware
app.use((req,res,next)=>{
  res.locals.nickname="Bob";


  // template helper functions 樣版輔助函式
  res.locals.toDateString = d => moment(d).format('YYYY-MM-DD');
  res.locals.toDateTimeString = d => moment(d).format('YYYY-MM-DD HH:mm:ss');
  next();
})


// app.get('/a.html', function (req, res) {
//   res.send(`<h2>動態內容</h2><p>${Math.random()}</p>`)
// });


// 路由
// EJS (樣板引擎)
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


// Advanced 取得JSON資料並排序 (switch case) ["name","age","id"]先過濾用戶輸入有沒有在這個陣列裡
app.get('/json-sales', (req,res)=>{
  const sales = require('./data/sales.json')
  // 排序之前先接收值
  // req.query.orderByCol = age
  // req.query.orderByRule = desc
  console.log(req.query);
  const col = req.query.orderByCol;
  const rule = req.query.orderByRule;
  // console.log(col)
  // console.log(rule);
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

  if (col==='name' && rule==='asc'){
    sales.sort(function(a,b){
      return a[col] > b[col] ? 1 : -1;
    })
  } else if (col==='name' && rule==='desc'){
    sales.sort(function(a,b){
      return a[col] > b[col] ? -1 : 1;
    })
  }

  if (col==='id' && rule==='asc'){
    sales.sort(function(a,b){
      return a[col] > b[col] ? 1 : -1;
    })
  } else if (col==='id' && rule==='desc'){
    sales.sort(function(a,b){
      return a[col] > b[col] ? -1 : 1;
    })
  }
  console.log(sales);
  res.render('json-sales',{sales, col:req.query.orderByCol, rule:req.query.orderByRule});
  
})
  

// 取得query String資料
app.get('/get-qs', function(req, res){
  res.json(req.query);
});


// try-post
// middleware移到最前面Top level
// const urlencodedParser = express.urlencoded({extended:false});
app.post('/try-post',(req,res)=>{
  res.json(req.body); // 如果要傳送json，可以使用res.json比較明確
  // res.send(req.body); // 結果是一樣，傳送array或object，send會自動轉換成JSON字串
})


// app.post('/try-post',(req,res)=>{
  // res.set('Content-Type','application/x-www-form-urlencoded');
  // res.type('application/x-www-form-urlencoded')
  // res.setHeader('Content-Type','text/plain')
  // res.send(req.body);
// })


// try-post-form
app.get('/try-post-form',(req,res)=>{
  res.render('try-post-form');
})
app.post('/try-post-form',(req,res)=>{
  res.render('try-post-form', req.body);
})


// upload file
// upload.single('欄位名稱') => middleware
app.post('/try-upload', upload.single('avatar'), async(req, res)=>{
  res.json(req.file);
//   // const types = ['image/jpeg', 'image/png','image/jpg']
//   // const f = req.file;   // 辨識是否有上傳檔案
//   // if(f && f.originalname){ // 如果有上傳檔案
//   //   if(types.includes(f.mimetype)){  // 且檔案類型符合
//   //     await fs.rename(f.path, __dirname+'/public/img/'+f.originalname);
//   //     return res.redirect('/img/' + f.originalname);
//   //   } else {   // 檔案類型不符合
//   //     return res.send('檔案類型不符');
//   //   }
//   // }
//   // // res.json(req.body);
//   // res.send('沒有上傳檔案');
});


// upload multiple files
app.post('/try-uploads', upload.array('photos'), async(req, res)=>{
  // 送出整個request，因為包含儲存路徑，會有安全性的問題
  // res.json(req.files);
  // 因此如何在送出req.files之前，進行資料處理，最後只送出mimetype filename size到前端
  const newFile = req.files.map(function(element){
      return {
        "mimetype" : element.mimetype,
        "filename" : element.filename,
        "size" : element.size
      }
  })
  res.json(newFile);
});


// Router
// 使用變數代稱設定路由
app.get('/my-params1/*/*?', (req,res)=>{
  res.json(req.params);
});
// 多個路徑使用同個處理器處理
app.get(['/xxx', '/yyy'], (req, res)=>{
  res.json({x:'y', url: req.url});
});
// 使用正規表示法設定路由
// \是跳脫，i是指不分大小寫
// 頭尾的 /^     $/ 是屬於regular expression的
app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res)=>{
  //為了避免url後面有query string，用split將?以後的東西一律都不要
  let u = req.url.split('?')[0];
  // 從index=3開始切
  u = u.slice(3);
  // 用空字串取代掉所有的 -，g代表global
  u = u.replace(/-/g, '');  // 也可以用 u = u.split('-').join(''); 也可以用 u = u.replaceAll('-','');
  res.json({mobile: u});
});
// 路由模組化
// const admin2Router = require('./routes/admin2');
// app.use(admin2Router);   // 當成middleware使用
// 可以直接寫成
app.use('/admin2',require('./routes/admin2'));

// 路由baseURL
app.use('/address-book',  require('./routes/address-book') );

// SESSION
app.get('/try-session', (req, res)=>{
  req.session.my_var = req.session.my_var || 0; // 預設為 0
  req.session.my_var++;
  res.json(req.session);
});


// moment
// 定義時間格式 https://momentjs.com/docs/#/displaying/
// 直接呼叫moment()，會得到當下的時間
// format(格式)
// tz('時區')
app.get('/try-moment', (req, res)=>{
    const fm = 'YYYY-MM-DD HH:mm:ss';
    res.json({
        'moment': moment().format(fm),
        'moment in London': moment().tz('Europe/London').format(fm),
        'cookie expire moment(+20min)': moment(req.session.cookie.expires).format(fm),
        'cookie expire moment in London(+20min)': moment(req.session.cookie.expires).tz('Europe/London').format(fm),
    });
});


// Connect MySQL
app.get('/try-db', async (req, res)=>{
    const sql = "SELECT * FROM address_book LIMIT 5";
    const [rs, fields] = await db.query(sql);
    res.json(rs);
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