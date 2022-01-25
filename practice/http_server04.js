// writeFile改寫成promises

const http = require('http');
// 使用內建的promises屬性
// 此時的變數fs已經與 http_server02.js的變數fs不一樣了
const fs = require('fs').promises;

const server = http.createServer((req, res) => {
    res.writeHead(200,{
        'Content-Type': 'text/html; charset=utf-8'
    });
    
    // fsPromises.writeFile(file, data[, options])
    fs.writeFile(__dirname+'/headers2.txt', JSON.stringify(req.headers,null,4))
    .then(()=>{
        res.end('ok');
    }).catch(error=>{
        res.end('error');
    });
});


server.listen(3000);