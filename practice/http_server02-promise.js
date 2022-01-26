// 寫入檔案改寫成Promise，但不使用內建Promise模組

const http = require('http');
const fs = require('fs');

function myWriteFile(file_path, req){
    return new Promise((resolve,reject)=>{

        fs.writeFile(file_path, JSON.stringify(req.headers,null,4), error => {
            if(error) return reject(error);
            resolve('成功寫入資料');
            }
        )   
    })
};

const server = http.createServer(async(req, res) => {
    res.writeHead(200,{
        'Content-Type': 'text/html; charset=utf-8'
    });
    
    const msg = await myWriteFile(__dirname+'/headers.txt', req);
    res.end(msg);
    
});

server.listen(3000);