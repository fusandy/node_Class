// 讀取檔案改寫成Promise，但不使用內建Promise模組

const http = require('http');
const fs = require('fs');


function myReadFile(file_path){
    return new Promise((resolve,reject)=>{

        fs.readFile(file_path, (error,data) => {
            if(error) return reject(error);
            resolve(data);
            }
        )   
    })
};

const server = http.createServer(async(req, res) => {
    res.writeHead(200,{
        'Content-Type': 'text/html; charset=utf-8'
    });

    // fs.readFile(path[, options], callback(error,data))
    const data = await myReadFile(__dirname+'/headers.txt');
    res.end(data);
});

server.listen(3000);


    