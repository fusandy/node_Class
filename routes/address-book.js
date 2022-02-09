// 同PHP處理資料列表

const express = require('express');
const db = require('./../modules/connect-db');
const router = express.Router();

// html輸出與API分開
async function getListData(req, res){
    const perPage = 10; // 每一頁最多幾筆
    // 用戶要看第幾頁
    let page = req.query.page ? parseInt(req.query.page) : 1;
    if(page < 1){
        return res.redirect('/address-book/list');
    }

    const conditions = {};  // 傳到template的條件

    // Search query string
    let search = req.query.search ? req.query.search : '';
    search = search.trim(); // 去掉頭尾空白
    /*let sqlWhere = '';
    if (search){
        // 有搜尋的時候，可以先做一個SQL WHERE字句
        sqlWhere = ` WHERE \`name\` LIKE ${db.escape('%'+search+'%')}`;
        conditions.search = search;
    } */

    // 另一種寫法，篩選條件用接的
    let sqlWhere = ' WHERE 1 ';
    if (search){
        // 有搜尋的時候，可以先做一個SQL WHERE字句
        sqlWhere += ` AND \`name\` LIKE ${db.escape('%'+search+'%')}`;
        // 如果用戶有search，把結果加進condition中，變成output輸出到template
        conditions.search = search;
    }



    // output 先定義要輸出的內容
    const output = {
        // success: false,
        perPage,
        page,
        totalRows: 0,
        totalPages: 0,
        rows: [],
        conditions
    };

    // 計算address_book裡面有幾筆資料，並給別名num以利取得陣列資料
    // const t_sql = "SELECT COUNT(1) num FROM address_book";

    // Search條件加進來算筆數  sqlWhere的結果是一個WHERE篩選字串
    const t_sql = `SELECT COUNT(1) num FROM address_book ${sqlWhere}`;
    // return res.send(t_sql); // 除錯用
    
    // db.query()執行sql抓出來的資料
    const [rs1] = await db.query(t_sql);
    console.log(rs1);   // [ { num: 128 } ]
    const totalRows = rs1[0].num;

    // 總頁數
    // let totalPages = 0;
    // 如果總筆數有值，計算總頁數
    if(totalRows) {
        output.totalPages = Math.ceil(totalRows/perPage);
        output.totalRows = totalRows;

        if(page > output.totalPages){
            return res.redirect(`/address-book/list?page=${output.totalPages}`);
        }

        // 插入變數，要改用backtick
        // const sql = `SELECT * FROM address_book LIMIT ${perPage*(page-1)}, ${perPage} `;

        // Search條件加入SQL資料讀取
        const sql = `SELECT * FROM \`address_book\` ${sqlWhere} ORDER BY sid ASC LIMIT ${perPage*(page-1)}, ${perPage} `;
        
        // 陣列解開設定
        const [rs2] = await db.query(sql);
        // console.log(rs2);

        // list.ejs template中不呼叫toDateString，改在路由function先處理資料，確保下方路由輸出資料都一致
        rs2.forEach(element=>{
            element.birthday = res.locals.toDateString(element.birthday);
        })
        console.log(rs2);
        output.rows = rs2;       
    }

    // res.json(output);
    
    return output;
}

// 如果沒有任何分頁，直接轉向到list page
router.get('/', async (req, res)=>{
    res.redirect('/address-book/list');
});
router.get('/list', async (req, res)=>{
    // template檔案位置，render只要寫該支list.ejs在哪即可，無須寫views/address-book/list
    res.render('address-book/list', await getListData(req, res));
});
router.get('/api/list', async (req, res)=>{
    res.json(await getListData(req, res));
});
router.get('/add', async (req, res)=>{
    res.render('address-book/add');
})
router.post('/add', async (req, res)=>{
    
})
module.exports = router;