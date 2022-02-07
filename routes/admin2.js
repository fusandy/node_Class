// index.js主程式已經require('express')，這邊再require只會拿到參照
const express = require('express');

// 透過express呼叫Router()function，得到一個物件，這邊稱之為router
const router = express.Router();

// 自訂的 middleware
router.use((req, res, next)=>{
    res.locals.nickname += ' Welcome Back!';
    next();
});

router.get('/', (req, res)=>{
    res.send('admin2: root');
});


router.get('/abc', (req, res)=>{
    res.send('admin2: abc');
});

router.get('/def', (req, res)=>{
    res.send('admin2: def');
});


router.get('/:p1?/:p2?', (req,res)=>{
    // 展開設定
    let {
        params,
        url,
        originalUrl,
        baseUrl,
    } = req;

    res.json({
        params,
        url,
        originalUrl,
        baseUrl,
        'locals.nickname': res.locals.nickname
    });
    // res.json(req.params);
})

module.exports = router;