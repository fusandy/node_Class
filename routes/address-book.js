// 同PHP的資料列表

const express = require('express');
const db = require('./../modules/connect-db');
const router = express.Router();

router.get('/list', async (req, res)=>{
    const perPage = 5; // 每一頁最多幾筆
    // 用戶要看第幾頁
    let page = req.query.page ? parseInt(req.query.page) : 1;
    if(page < 1){
        return res.redirect('/address-book/list');
    }

    // output 先定義要輸出的內容
    const output = {
        // success: false,
        perPage,
        page,
        totalRows: 0,
        totalPages: 0,
        rows: []
    };

    // 計算address_book裡面有幾筆資料，並給別名num以利取得陣列資料
    const t_sql = "SELECT COUNT(1) num FROM address_book";
    // db.query()執行sql抓出來的資料
    const [rs1] = await db.query(t_sql);
    console.log([rs1]);   // [ { num: 128 } ]
    const totalRows = rs1[0].num;

    // 總頁數
    let totalPages = 0;
    // 如果總筆數有值，計算總頁數
    if(totalRows) {
        output.totalPages = Math.ceil(totalRows/perPage);
        output.totalRows = totalRows;

        if(page > output.totalPages){
            return res.redirect(`/address-book/list?page=${output.totalPages}`);
        }

        // 插入變數，要改用backtick
        const sql = `SELECT * FROM address_book LIMIT ${perPage*(page-1)}, ${perPage} `;
        const [rs2] = await db.query(sql);
        console.log([rs2])
        output.rows = rs2;
    }

    // res.json(output);
    // template檔案位置，render使用相對位置，只要寫該支list.ejs在哪即可，無須寫views/address-book/list
    res.render('address-book/list', output);
});
module.exports = router;