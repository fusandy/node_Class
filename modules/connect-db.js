const mysql = require('mysql2');

// createConnection (單個連線)
// pool 連線池(多個連線)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 5, // 最大連線數
    queueLimit: 0
})

module.exports = pool.promise();