// writeFile改寫成async await

const http = require('http');
const fs = require('fs').promises;

// async 可以寫在任何函式之前，代表"宣告這是一個非同步的函式，且這個函式會return一個Promise物件"
const server = http.createServer(async(req, res) => {
    res.writeHead(200,{
        'Content-Type': 'text/html; charset=utf-8'
    });
    
    // async函式中，使用await，代表"請等待這個非同步完成，才展開後續動作"
    try {
        await fs.writeFile(__dirname+'/headers2.txt', JSON.stringify(req.headers,null,4));
    } catch(ex){
        return res.end('error:'+ ex);
    }
    
    res.end('ok');
});

server.listen(3000);