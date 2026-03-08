var http = require('http');
var url = require('url');
var fs = require('fs');
var data = require('../Лабораторная работа 4/m04');

var db = new data.DB();
var timerId;
var intervalId;
var statId;

var stat = {
    start: null,
    finish: null,
    request: 0,
    commit: 0,
    isFull: false
};

db.on('COMMIT', (req, res)=>{
    let comm = db.commit();
    stat.commit++;
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(JSON.stringify(comm));
});

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

var server = http.createServer(function(req, res){
    if(url.parse(req.url).pathname === '/api/db'){
        if(req.method === 'COMMIT'){
            db.emit('COMMIT', req, res);
        }
        else{
            db.emit(req.method, req, res);
        }
        stat.request++;
    }
    else if(url.parse(req.url).pathname === '/'){
        let html = fs.readFileSync('../Лабораторная работа 4/04-02.html');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(html);
    }
    else if(url.parse(req.url).pathname === '/api/ss'){
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(stat));
    }
    else{
        res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end("НЕ УДАЛОСЬ НАЙТИ СТРАНИЦУ!");
    }
}).listen(5000);

process.stdin.setEncoding('utf-8');
process.stdin.on('data', (data)=>{
    let chunk = data.trim();
    let mas = chunk.split(' ');
    if(mas.length === 0){
        console.log("You must input command!");
    }
    else if (mas.length === 1){
        if(mas[0] === 'sd'){
            if(timerId){
                clearTimeout(timerId);
                timerId = null;
            }
        }
        else if(mas[0] === 'sc'){
            if(intervalId){
                clearInterval(intervalId);
                intervalId = null;
            }
        }
        else if(mas[0] === 'ss'){
            if(statId){
                clearTimeout(statId);
                statId = null;
                stat.finish = new Date().toISOString();
                stat.isFull = false;
            }
        }
        else{
            console.log("Unknown command!");
        }
    }
    else if (mas.length === 2){
        if(mas[0] === 'sd'){
            if(timerId){
                clearTimeout(timerId);
            }
            timerId = setTimeout(() =>{
                server.close(() => {
                    console.log("server close");
                    process.exit(0);
                });
            }, parseInt(mas[1]) * 1000);
        }
        else if(mas[0] === 'sc'){
            if(intervalId){
                clearInterval(intervalId);
            }
            intervalId = setInterval(()=>{
                db.commit();
                stat.commit++;
            }, parseInt(mas[1]) * 1000);

            intervalId.unref();
        }
        else if(mas[0] === 'ss'){
            if(statId){
                clearTimeout(statId);
            }

            stat = {
                start: new Date().toISOString(),
                finish: null,
                request: 0,
                commit: 0,
                isFull: false
            };

            statId = setTimeout(()=>{
                stat.finish = new Date().toISOString(),
                stat.isFull = true,
                statId = null
            }, parseInt(mas[1]) * 1000);
            statId.unref();
        }
        else{
            console.log("Unknown command!");
        }
    }
    else{
        console.log("Invalid command!");
    }
});