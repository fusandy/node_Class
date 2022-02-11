const express = require('express');
const db = require('./../modules/connect-db');
const router = express.Router();
const upload = require('./../modules/upload-imgs');

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
            let str = res.locals.toDateString(element.birthday);
            // element.birthday = res.locals.toDateString(element.birthday);
            if (str === 'Invalid date'){
                element.birthday = '用戶尚未輸入生日';
            } else {
                element.birthday = str;
            }
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

// list頁畫面呈現路由
router.get('/list', async (req, res)=>{
    // template檔案位置，render只要寫該支list.ejs在哪即可，無須寫views/address-book/list
    res.render('address-book/list', await getListData(req, res));
});


router.get('/api/list', async (req, res)=>{
    res.json(await getListData(req, res));
});


// 新增頁畫面呈現路由
router.get('/add', async (req, res)=>{
    res.render('address-book/add');
})


// 'Content-Type': 'multipart fromdata' 需要呼叫middleware
router.post('/add2', upload.none(), async (req, res)=>{
    res.json(req.body);
});

// 新增路由
// 'Content-Type': 'application/json'
// 'Content-Type': 'application/x-www-form-urlencoded'
router.post('/add', async (req, res)=>{

    const output = {
        success:false,
        error:'',
    }

    // req.body.name ? req.body.name : '';
    // req.body.email ? req.body.email : '';
    // req.body.mobile ? req.body.mobile : '';

    // body('')
    
    // 前端的隱藏欄位若對應不上後端資料庫欄位名稱會報錯
    /*
    const sql = "INSERT INTO address_book SET ?";
    const insertData = {...req.body, created_at:new Date()};
    const [insertResult] = await db.query(sql, [insertData]);
    console.log(insertResult); 
    */

    // 建議寫法
    // TODO: 資料格式檢查
    const sql = "INSERT INTO `address_book`(`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?,?,?,?,?,NOW())";
    const [insertResult] = await db.query(sql, [
        req.body.name,
        req.body.email,
        req.body.mobile,
        req.body.birthday || null,
        req.body.address,    
    ]);
    console.log(insertResult); 
    output.success = !!insertResult.affectedRows;   // 如果affectedRows有值代表寫入成功，!!轉成步林值就是true
    output.result = insertResult.affectedRows;
    res.json(output);
})


// 刪除路由
router.get('/delete/:sid', async (req, res)=>{
    const sql = "DELETE FROM address_book WHERE sid=?";
    const [deleteResult] = await db.query(sql, [req.params.sid]);
    backURL = req.get('Referer') || '/address-book/list';
    res.redirect(backURL);
});


// 編輯前有沒有拿到sid的資料的路由
router.get('/edit/:sid', async (req, res)=>{
    const sql = "SELECT * FROM address_book WHERE sid=?";
    const [editResult] = await db.query(sql, [req.params.sid]);

    // 判斷有沒有拿到該筆sid的資料
    if(editResult.length === 0){
        //沒有就跳轉回list page
        return res.redirect('/address-book/list')
    }

    res.render('address-book/edit', editResult[0]);
});
// 編輯完提交表單的路由
router.post('/edit/:sid', async (req, res)=>{
    const output = {
        success:false,
        error:'',
    }

    const sql = "UPDATE address_book SET ? WHERE sid=?";
    const [editResult] = await db.query(sql, [
        req.body,
        req.params.sid
    ]);
    output.success = !! editResult.changedRows;
    console.log('output.success',output.success)
    output.result = editResult;

    res.json(output)

    // changedRows 變化的筆數 (假設資料沒修改直接提交，ans=0)
    // affectedRows 找到的筆數 (假設資料沒修改直接提交，ans=1)
});


module.exports = router;