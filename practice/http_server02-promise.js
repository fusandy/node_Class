// 寫入檔案改寫成Promise，但不使用內建Promise模組

const http = require('http');
const fs = require('fs');

// TODO: new Promise


const server = http.createServer((req, res) => {
    res.writeHead(200,{
        'Content-Type': 'text/html; charset=utf-8'
    });
    
    // fs.writeFile(file, data[, options], callback(error))
    fs.writeFile(__dirname+'/headers.txt', JSON.stringify(req.headers,null,4), error => {
        if(error){
            console.log(error);
            res.end('錯誤');
        }else{
            res.end('<h1>沒問題</h1>')
        }
    })   
});

server.listen(3000);