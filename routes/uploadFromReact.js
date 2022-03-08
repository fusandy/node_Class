// React 上傳圖片的router
const express = require('express');
const res = require('express/lib/response');
const db = require('./../modules/connect-db');
const router = express.Router();
const upload = require('./../modules/upload-imgs');


router.get('/myform/:sid', async(req, res)=>{
    const output = {
        success:false,
        error:''
    }
    const sid = parseInt(req.params.sid) || 0;
    const [rs] = await db.query(`SELECT * FROM admins WHERE sid=${sid}`)

    res.json(rs)
})

router.put('/myform/:sid', upload.single('avatar'), async(req, res)=>{
    // 除錯
    // return res.json(req.body);
    const output = {
        success:false,
        error:''
    }
    // 圖片檔屬於request的file屬性
    console.log('req.file:', req.file)
    let modifyAvatar = '';
    // 判斷有沒有拿到檔案
    if(req.file && req.file.filename){
        // 先創造符合sql的update字串格式，然後直接將變數塞進去SQL的UPDATE語法中
        modifyAvatar = `, avatar='${req.file.filename}' `;
    }
    const sql = `UPDATE admins SET nickname=? ${modifyAvatar} WHERE sid=? `;
    const result = await db.query(sql, [req.body.nickname, req.params.sid]);
    console.log('result:', result)

    // TODO: 判斷result是不是row count，改成回傳output
    console.log('result.changedRows:',result[0].changedRows)
    output.success = !!result[0].changedRows;   // 如果affectedRows有值代表寫入成功，!!轉成步林值就是true

    res.json(output)
    console.log('output:', output)
})


module.exports = router;