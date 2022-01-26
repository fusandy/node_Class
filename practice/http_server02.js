// 寫入檔案 fs=filesystem

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    res.writeHead(200,{
        'Content-Type': 'text/html; charset=utf-8'
    });
    
    // 相對路徑: './headers.txt' 以專案根目錄為儲存路徑
    // 發需求的檔頭會被解析成物件，所以把物件轉換成JSON字串
    // JSON.stringify(value[, replacer取代文字[, space縮排]])

    // fs.writeFile(file, data[, options], callback(error))
    fs.writeFile(__dirname+'/headers.txt', JSON.stringify(req.headers,null,4), error => {
        // callback function的參數預設是error(error first錯誤先行)，沒有錯誤就是空值
        if(error){
            console.log(error);
            res.end('錯誤');
        }else{
            res.end('<h1>沒問題</h1>')
        }
    })   
});

server.listen(3000);