const db = require('./../modules/connect-mysql');

const tableName = 'carts';
const pkField = 'sid';


class Cart {

    constructor(defaultObj={}) {
        // `sid`, `author`, `bookname`, `category_sid`, `book_id`, `publish_date`, `pages`, `price`, `isbn`, `on_sale`, `introduction`
        this.data = defaultObj;
    }

    /* 讀取所有資料, 要有篩選的功能 */
    static async getList(member_id){
        const sql = `SELECT c.*, p.bookname, p.price  FROM carts c
                        JOIN products p 
                        ON p.sid=c.product_id
                    WHERE member_id=? ORDER BY created_at`;
        const [rs] = await db.query(sql, [member_id]);
        return rs;
    }

    /* 透過商品 id 找項目 */
    static async findItem(member_id=0, product_id=0){
        const sql = `SELECT * FROM ${tableName} WHERE member_id=? AND product_id=?`;
        const [rs] = await db.query(sql, [member_id, product_id]);
        if(rs && rs.length===1){
            return rs[0];
        }
        return null;
    }

    static async add(member_id, product_id, quantity){
        const output = {
            success: false,
            error: ''
        }
        // TODO: 三個參數都必須要有資料

        // 不要重複輸入資料
        if(await Cart.findItem(member_id, product_id)){
            output.error = "資料重複了";
            return output;
        }

        const obj = {
            member_id, product_id, quantity
        };

        const sql = `INSERT INTO carts SET ?`;
        const [r] = await db.query(sql, [obj]);
        output.success = !!r.affectedRows ? true : false;
        output.cartList = await Cart.getList(member_id);
        return output;
    }

    // 變更數量
    static async update(member_id, product_id, quantity){
        // TODO:
    }

    // 移除項目
    static async remove(member_id, product_id){
        // TODO:
    }

    // 清空購物車
    static async clear(member_id){
        // TODO:
    }
}

module.exports = Cart;


