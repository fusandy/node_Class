require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const req = require('express/lib/request');
const fs = require('fs').promises;
const moment = require('moment-timezone');
const db = require('./modules/connect-db'); 
const sessionStore = new MysqlStore({},db);  // 因為已用模組設定連線，這邊就給{空物件}
const cors = require('cors');
const fetch = require('node-fetch');
const axios = require('axios');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

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
// 允許瀏覽器跨網域資源共用
// const corsOptions = {
//   credentials: true,
//   origin: function(origin, cb){
//       console.log('origin:', {origin});
//       cb(null, true);
//   }
// };
// app.use(cors(corsOptions));
app.use(cors());
// 判斷是否為urlencoded，是才處理，不是就跳過
app.use(express.urlencoded({extended:false}));

// 判斷是否為json，是才處理，不是就跳過
app.use(express.json());

// 引入靜態內容的資料夾檔案(server不會再去修改的內容稱之為靜態內容)
app.use(express.static('public'));
// 加了前綴，找檔案的路徑比較明確，不加也可以，那檔案就會在根目錄
app.use('/joi', express.static('node_modules/joi/dist/'));


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

  // 0308 token from request headers
  res.locals.auth = null ; // 自訂的變數，設定有沒有身分驗證，預設值是null
  let auth = req.get('Authorization')
  console.log('auth:',auth)
  // 如果auth有值，且有包含Bearer 的字串，位置在index為0
  if(auth && auth.indexOf('Bearer ')===0){
    // 字串從index=7切到最後面
    auth = auth.slice(7)
    console.log('auth.slice(7):',auth)
    try{
      const payload = jwt.verify(auth, process.env.JWT_KEY)
      console.log('payload:', payload)
      // 如果驗證token合法，則把解析的物件放進res.locals.auth自定義變數中
      res.locals.auth = payload;
      console.log('res.locals.auth:', res.locals.auth)
    }catch(ex){

    }
  }


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
/* const admin2Router = require('./routes/admin2'); */
/* app.use(admin2Router);   // 當成middleware使用 */
// 可以直接寫成
app.use('/admin2',require('./routes/admin2'));
app.use('/uploadFromReact',require('./routes/uploadFromReact'));


/* ('路徑的前綴' , require('路由的檔案') */
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


// node-fetch 拜訪外部網站
app.get('/yahoo', async (req, res)=>{
  fetch('https://tw.yahoo.com/')
      .then(r=>r.text())
      .then(txt=>{
          res.send(txt);
      });
});


// axios 拜訪外部網站
app.get('/yahoo2', async (req, res)=>{
  const response = await axios.get('https://tw.yahoo.com/');
  console.log(response);
  res.send(response.data);
});


// send auto mail
app.post('/mailtest', (req, res) => {
  console.log(req.body)
  const emailAddress = req.body.email

  const output = {
    success: false,
    error:'',
  }

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'disneydisney.watch@gmail.com',
      pass: 'tapatfivrpgehvjx'
    }
  });
  
  let mailOptions = {
    from: 'disneydisney.watch@gmail.com',
    to: emailAddress,
    subject: '報名通知',
    text: '感謝您的報名，XXXX活動將於XXXX舉行，敬請準時報到參加!謝謝'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      output.error = error
      return res.send(output);
    } else {
      output.success = true
      return res.send(output);
    }
  });
});


// 0307: JSON　Web Token address-book login
// 登入的表單
app.get('/login', async(req,res)=>{
  res.render('login')
})
// 送出檢查帳號密碼
app.post('/login', async(req,res)=>{
  // res.json(req.body)
  // req.body.account
  // req.body.password
  const output = {
    success:false,
    error:'',
    info:'',
    token:'',
    code:0,
  }

  const [rs] = await db.query('SELECT * FROM admins WHERE account=?', [req.body.account])
  // 如果查無帳號，則length=0，!反轉變成true,進入if流程控制
  if(!rs.length){
    output.error = '帳號錯誤';
    output.code = 401;
    return res.json(output);
  }

  // 找到的話，比對密碼是否一致
  const row = rs[0];
  const compareResult = await bcrypt.compare(req.body.password, row.password)
  if(!compareResult){
    output.error = '密碼錯誤';
    output.code = 402;
    return res.json(output);
  }

  // 如果帳號密碼都正確，把output回傳給前端
  // 先解構row，假設找到資料後要回傳 {帳號、大頭貼、暱稱} 給前端
  const { sid, account, avatar, nickname } = row;
  output.success = true;
  output.info = { account, avatar, nickname };
  // 驗證成功後，生成token回傳給前端，後續前端要把token存在用戶的localstorage
  output.token = jwt.sign({ sid, account }, process.env.JWT_KEY);
  res.json(output);
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