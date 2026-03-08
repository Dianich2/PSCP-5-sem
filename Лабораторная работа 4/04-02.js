var http = require('http');
var url = require('url');
var fs = require('fs');
var data = require('./m04');

var db = new data.DB();

db.on('GET', (req, res)=>{
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(JSON.stringify(db.select()));
});

db.on('POST', (req, res)=>{
    req.on('data', data =>{
        let cur_data = JSON.parse(data);
        cur_data = db.insert(cur_data);
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(cur_data));
    })
});

db.on('PUT', (req, res)=>{
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () =>{
        let cur_data = JSON.parse(body);
        let upd_elem = db.update(cur_data);
        if(upd_elem === null){
            res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify("ДАННЫЕ НЕ УДАЛОСЬ ОБНОВИТЬ, ТАК КАК ТАКОЙ ЗАПИСИ НЕ СУЩЕСТВУЕТ!"));
        }
        else{
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(cur_data));
        }
    })
});

db.on('DELETE', (req, res)=>{
        let cur_data = url.parse(req.url, true).query;
        let del_elem = db.delete(cur_data.id);
        if(del_elem === null){
            res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify("ДАННЫЕ НЕ УДАЛОСЬ УДАЛИТЬ, ТАК КАК ТАКОЙ ЗАПИСИ НЕ СУЩЕСТВУЕТ!"));
        }
        else{
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(del_elem));
        }
});

http.createServer(function(req, res){
    if(url.parse(req.url).pathname === '/api/db'){
        db.emit(req.method, req, res);
    }
    else if(url.parse(req.url).pathname === '/'){
        let html = fs.readFileSync('04-02.html');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(html);
    }
    else{
        res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end("НЕ УДАЛОСЬ НАЙТИ СТРАНИЦУ!");
    }
}).listen(5000);