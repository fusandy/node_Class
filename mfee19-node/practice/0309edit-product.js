const Product = require('./../models/Product');

// 修改資料
let product03;
(async ()=>{
    product03 = await Product.findProduct(2);
    console.log('product03:', product03)
    
    const r = await product03.update({
        author:'Shinder Lin'
    })

    console.log(r)
    process.exit()
})()