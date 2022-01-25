// 讀取檔案

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    
    // (error,data) data才是要呈現在瀏覽器上的資料
    // 錯誤先行: 先處理錯誤
    fs.readFile(__dirname+'/headers.txt', (error,data) => {
        
        if(error){
            console.log(error);
            res.end('錯誤');
        }else{
            res.writeHead(200,{
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(data);
        }
    })   
});

server.listen(3000);