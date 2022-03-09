const Product = require('./../models/Product');

// 呼叫類別的靜態方法，給有效的primary key，會得到相對應的Product物件
let product02; 
(async ()=>{
    product02 = await Product.findProduct(8);
    console.log('product02:', product02)
    process.exit()
})()


