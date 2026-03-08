var http = require('http');
var path = require('path');
var myH = require('./m07-01');

const pathToStatic = path.join(__dirname, 'static');
const exH = myH(pathToStatic);

const server = http.createServer((req, res) =>{
    if(req.method !== 'GET'){
        res.writeHead(405, {'Content-Type':'text/plain; charset=utf-8'});
        res.end('Method not allowed');
        return;
    }
    exH(req, res);
}).listen(5000);