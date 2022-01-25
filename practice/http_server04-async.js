// writeFile改寫成async await

const http = require('http');
const fs = require('fs').promises;

const server = http.createServer(async(req, res) => {
    res.writeHead(200,{
        'Content-Type': 'text/html; charset=utf-8'
    });
    
    try {
        await fs.writeFile(__dirname+'/headers2.txt', JSON.stringify(req.headers,null,4));
    } catch(ex){
        return res.end('error');
    }
    
});

server.listen(3000);