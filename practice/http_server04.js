// writeFile改寫成promises

const http = require('http');
// 使用promises內建方法
const fs = require('fs').promises;

const server = http.createServer((req, res) => {
    res.writeHead(200,{
        'Content-Type': 'text/html; charset=utf-8'
    });
    
    fs.writeFile(__dirname+'/headers2.txt', JSON.stringify(req.headers,null,4))
    .then(()=>{
        res.end('ok');
    });
});


server.listen(3000);