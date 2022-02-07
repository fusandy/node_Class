// index.js主程式已經require('express')，這邊再require只會拿到參照
const express = require('express');


const router = express.Router();

router.get('/admin2/:p1?/:p2?', (req,res)=>{
    res.json(req.params);
})

module.exports = router;