// 讀取檔案

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    res.writeHead(200,{
        'Content-Type': 'text/html; charset=utf-8'
    });
    // (error,data) data才是要呈現在瀏覽器上的資料
    // 錯誤先行: 先處理錯誤

    // fs.readFile(path[, options], callback(error,data))
    fs.readFile(__dirname+'/headers.txt', (error,data) => {
        
        if(error){
            console.log(error);
            res.end('錯誤');
        }else{
            // 讀出來是文字檔text/html，但是可以告訴前端data內容是json
            res.writeHead(200,{
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(data);
        }
    })   
});

server.listen(3000);
    