const Product = require('./../models/Product');

// 建立一個繼承Product類型的物件，並將資料寫進資料庫
const product01 = new Product({author:'David Huang', bookname:'Javascript學不會'});

// save() in Product is an async await function which should be used with 'then'
product01.save().then(r=>{
    console.log('r:', r)
    console.log('product01:',product01)
    // 結束後就離開
    process.exit();
});