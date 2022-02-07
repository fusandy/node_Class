// index.js主程式已經require('express')，這邊再require只會拿到參照
const express = require('express');

// 建立router物件
const router = express.Router();

// 自訂的 middleware
router.use((req, res, next)=>{
    res.locals.nickname += ' Welcome Back!';
    next();
});

router.get('/', (req, res)=>{
    res.send('admin2: root');
});

router.get('/admin2/:p1?/:p2?', (req,res)=>{
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