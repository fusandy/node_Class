require('dotenv').config(); // 載入 .env 的設定

const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const cors = require('cors');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const MysqlStore = require('express-mysql-session')(session);
const moment = require('moment-timezone');
const upload = multer({dest: 'tmp_uploads/'});
const uploadImg = require('./modules/upload-images');
const db = require('./modules/connect-mysql');
const sessionStore = new MysqlStore({}, db);

const app = express();

app.set('view engine', 'ejs');

app.use(session({
    name: 'mySessionId',
    saveUninitialized: false,
    resave: false,
    store: sessionStore,
    secret: '34908-948fkdgha;kldfha;olfisjl;;asdl',
    cookie: {
        maxAge: 1200000,
    }
}));
const corsOptions = {
    credentials: true,
    origin: (origin, cb)=>{
        console.log(`origin: ${origin}`);
        cb(null, true);
    }
};
app.use( cors(corsOptions) );

app.use( express.urlencoded({extended: false}) );
app.use( express.json() );
app.use(express.static('public'));
app.use('/jquery', express.static('node_modules/jquery/dist'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));

// 自訂的 middleware
app.use(async (req, res, next)=>{
    res.locals.title = '小新的網站';
    res.locals.pageName = '';
    res.locals.keyword = '';

    // 設定 template 的 helper functions
    res.locals.dateToDateString = d => moment(d).format('YYYY-MM-DD');
    res.locals.dateToDateTimeString = d => moment(d).format('YYYY-MM-DD HH:mm:ss');

    res.locals.session = req.session; // 把 session 的資料傳到 ejs


    // jwt 驗證
    req.myAuth = null;  // 自訂的屬性 myAuth
    const auth = req.get('Authorization');
    if(auth && auth.indexOf('Bearer ')===0){
        const token = auth.slice(7);
        try{
            req.myAuth = await jwt.verify(token, process.env.JWT_SECRET);
            console.log('req.myAuth:', req.myAuth);
        } catch(ex) {
            console.log('jwt-ex:', ex);
        }
    }

    next();
});

// *** 路由定義開始 :BEGIN
app.get('/', (req, res)=>{

    res.locals.title = '首頁 - ' + res.locals.title;
    res.render('home', {name: 'Shinder'});

    //res.send(`<h2>Hello</h2>`);
});

app.get('/json-sales', (req, res)=>{
    res.locals.pageName = 'json-sales';
    const sales = require('./data/sales');

    // console.log(sales);
    // res.json(sales);
    res.render('json-sales', {sales});
});

app.get('/try-qs', (req, res)=>{
    res.json(req.query);
});

app.post('/try-post', (req, res)=>{
    res.json(req.body);
});

app.get('/try-post-form', (req, res)=>{
    res.render('try-post-form');
});

app.post('/try-post-form', (req, res)=>{
    res.render('try-post-form', req.body);
});

app.get('/pending', (req, res)=>{
});

app.post('/try-upload', upload.single('avatar'), async (req, res)=>{
    if(req.file && req.file.mimetype==='image/jpeg'){
        try {
            await fs.rename(req.file.path, __dirname + '/public/img/' + req.file.originalname);
            return res.json({success: true, filename: req.file.originalname});
        } catch(ex){
            return res.json({success: false, error: '無法存檔', ex});
        }

    } else {
        await fs.unlink(req.file.path);  // 刪除暫存檔
        res.json({success: false, error: '格式不對'});
    }
});

app.post('/try-upload2', uploadImg.single('avatar'), async (req, res)=>{
    res.json(req.file);
});

app.post('/try-upload3', uploadImg.array('photo', 10), async (req, res)=>{
    res.json(req.files);
});

app.get('/my-params1/:action?/:id(\\d+)?', (req, res)=>{
    res.json(req.params);
});
app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res)=>{
    let u = req.url.split('?')[0];
    u = u.slice(3);
    u = u.split('-').join('');

    res.json({
        url: req.url,
        mobile: u
    });
});

app.use(require('./routes/admin2'));
app.use('/', require('./routes/login'));
app.use('/admin3', require('./routes/admin3'));
app.use('/address-book', require('./routes/address-book'));
app.use('/product', require('./routes/product'));
app.use('/cart', require('./routes/cart'));

app.get('/try-sess', (req, res)=>{
    req.session.myVar = req.session.myVar || 0;
    req.session.myVar++;

    res.json(req.session);
});

app.get('/try-moment', (req, res)=>{
    const fm = 'YYYY-MM-DD HH:mm:ss';

    res.json({
        m1: moment().format(fm),
        m2: moment().tz('Europe/Berlin').format(fm),
        m3: moment().tz('Asia/Tokyo').format(fm),
    });
});

app.get('/try-db', async (req, res)=>{
    const [r] = await db.query("SELECT * FROM address_book WHERE `name` LIKE ?", ['%新%']);

    res.json(r);

});

app.post('/test_avatar', uploadImg.none(), async (req, res)=>{
    const sql = "INSERT INTO `test_avatar`(`avatar`, `name`) VALUES (?, ?)";
    const [r] = await db.query(sql, [req.body.avatar, req.body.name]);
    res.json(r);
});
app.get('/test_avatar/:id', async (req, res)=>{
    const sql = "SELECT * FROM `test_avatar` WHERE sid=?";
    const [r] = await db.query(sql, [req.params.id]);
    res.json(r[0] ? r[0] : {});
});
app.put('/test_avatar/:id', uploadImg.none(), async (req, res)=>{
    const sql = "UPDATE `test_avatar` SET ? WHERE sid=?";
    const [r] = await db.query(sql, [req.body, req.params.id]);
    res.json(r);
});


// *** 路由定義結束 :END

app.use((req, res)=>{
    res.status(404).send(`<h1>找不到頁面</h1>`)
})

let port = process.env.PORT || 3000;
const node_env = process.env.NODE_ENV || 'development';
app.listen(port, ()=>{
    console.log(`NODE_ENV: ${node_env}`);
    console.log(`啟動: ${port}`, new Date());
});