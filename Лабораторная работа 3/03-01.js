var http = require('http');
var fs = require('fs');

var curStat = 'norm';
http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type': 'text/html'})
    response.end('<h2>'.concat(curStat, '</h2>'));
}).listen(5000, ()=>'Server is running at http://localhost:5000');

process.stdin.setEncoding('utf-8');
process.stdin.on('data', (data)=>{
    let chunk = data.trim();
    switch(chunk.trim()){
        case 'norm':
        case 'stop':
        case 'idle':
        case 'test':
            process.stdout.write("reg = ".concat(curStat, '-->', chunk).concat('\n'));
            curStat = chunk;
            break;
        case 'exit':
            process.exit(0);
        default:
            process.stdout.write('Unknown mode: '.concat(chunk, '\n'));
            break
    }
})






