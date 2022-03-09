require('dotenv').config()
const db = require('./../modules/connect-db');

class Product {

    // 先將資料預設成空物件
    constructor(data={}){
        // ToDo: 哪些是必要欄位
        // sid, author, bookname, category_sid, book_id, publish_date, pages, price, isbn, on_sale, introduction 
        const defaultData ={
            author:'',
            bookname:'',
            category_sid:'4',
            book_id:'',
            publish_date: '1970-01-01',
            pages:0,
            price:0,
            isbn:'',
            on_sale:1,
            introduction:''
        }
        // 資料進來後，先解構，再覆蓋
        this.data = {...defaultData, ...data}
    }

    // 新增資料
    // save data
    async save(){
        const [result] = await db.query('INSERT INTO `products` SET ?', [this.data])
        // console.log('result:',result);
        this.data.sid = result.insertId
        return{
            success: !! result.insertId,
            insertId: result.insertId,
            instance: this,
        }
    }

    // 查找產品
    // 靜態方法 屬於 類別的方法
    static async findProduct(primaryKey){
        primaryKey = parseInt(primaryKey);

        // if primaryKey is not a Number or it is not defined
        if(isNaN(primaryKey) || !primaryKey){
            return null;
        }
        const [rs] = await db.query(`SELECT * FROM products WHERE sid = ${primaryKey}`);
        console.log(rs)
        // rs is an array
        if(!rs.length){
            return null;
        }
        
        // if data has been found
        return new Product({...rs[0]})
    }

    // 更新資料
    async update(modify={}){
        // this.data 存在這個Product個體裡
        const primaryKey = this.data.sid;
        // if there's no available primary key
        if(!primaryKey){
            return {success:false};
        }
        // 原本的資料展開，用戶要改的資料也展開，有符合就會覆蓋
        const data = {...this.data, ...modify}
        // 先暫時把sid刪除，避免影響
        delete this.data.sid;
        // UPDATA再把sid加回來
        const [result] = await db.query(`UPDATE products SET ? WHERE sid=?`, [data,primaryKey])
        console.log('edit result:', result)
        return {success: !!result.affectedRows}
    }

    // 刪除資料
    async delete(){
        const primaryKey = this.data.sid;
        console.log('primaryKey:', primaryKey)

        if(!primaryKey){
            return {success:false};
        }
        const [result] = await db.query(`DELETE FROM products WHERE sid=?`, [primaryKey])
        delete this.data.sid;
        console.log('delete result:', result)
        return {success: !!result.affectedRows}
    }
    
}

module.exports = Product
