const Product = require('../models/Product');
console.log('1223:')
let product05;
(async()=>{
    product05 = await Product.findProduct(29);
    console.log('product05:', product05)
    await product05.delete()
    process.exit();
})()


