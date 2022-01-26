// 載入.env檔案中的設定
require('dotenv').config();

// 在env設定的環境變數，都會進到process.env變成其中的屬性名稱
console.log('process.env.DB_USER:',process.env.DB_USER)
console.log('process.env.DB_PASS:',process.env.DB_PASS)