const Product = require('../models/Product');

// 新增+修改資料
let product04;
(async ()=>{
    // 建立新資料
    product04 = new Product({author:'Wang', bookname:'HAHAHAHA'});

    // 儲存
    await product04.save().then(r=>{
        console.log('r',r)
    });

    // 修改
    await product04.update({author:'wwwwwwwwwwwwwwwwwwwww'}).then(r=>{
        console.log('r:',r)
    });
    process.exit();
})()