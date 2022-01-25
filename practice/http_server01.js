const http = require('http');

// client request 
// server response 

// apache 會自動配發用戶要看什麼內容
// node 不會自動配發，所有用戶有request都會進到經過這支server
// 先載入原始碼，再編譯，如果server沒有停下來，但是中間編譯有變動，需要重新啟動server
const server = http.createServer((req, res) => {
    //callback function
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write('<div>123</div>');
    res.end(`<h2>Hello World</h2>
    <p>${req.url}</p>
    `);
});

server.listen(3000);