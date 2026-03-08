const fs = require('fs');
const url = require('url');
const http = require('http');
const path_s = require('path');
const moment = require('moment');
const rpcWSS = require('rpc-websockets').Server;
const wsS = new rpcWSS({ port: 5000, host:'localhost' });
wsS.event('event'); 

const server = http.createServer((req, res) => {
    var path = url.parse(req.url, true).pathname;
    if(req.method === 'GET'){
        var parts = path.split('/').filter(p => p != '');
        if(parts.length == 0){
            fs.readFile('./StudentList.json', 'utf8', (err, data) => {
                if (err) {
                    const p = path_s.join(__dirname, 'StudentList.json');
                    const errMessage = JSON.stringify({
                        "error": 1,
                        "message": `Ошибка чтения файла ${p}`
                    });
                    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(errMessage);
                    return;
                }
                const json = JSON.parse(data);

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(json));
            });
            return;
        }
        if(parts.length == 1 && parts[0] == 'backup'){
            fs.readdir(__dirname, (err, files) => {
                if (err) {
                    const errMessage = JSON.stringify({
                        "error": 6,
                        "message": `Ошибка чтения содержимого текущей директории`
                    });
                    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(errMessage);
                    return;
                }

                const foundFiles = files.filter(file => {
                  return file.includes('StudentList.json');
                });
            
                if (foundFiles.length > 0) {
                  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                  res.end(JSON.stringify(foundFiles));
                  return;
                } else {
                  const errMessage = JSON.stringify({
                        "error": 7,
                        "message": `Файлы не найдены`
                    });
                    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(errMessage);
                    return;
                }
            });
            return;
        }
        var n = parseInt(parts[0], 10);
        if(isNaN(n)){
            const errMessage = JSON.stringify({
                "error": 5,
                "message": `Неверный id`
            });
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(errMessage);
            return;
        }
        fs.readFile('./StudentList.json', 'utf8', (err, data) => {
                if (err) {
                    const p = path_s.join(__dirname, 'StudentList.json');
                    const errMessage = JSON.stringify({
                        "error": 1,
                        "message": `Ошибка чтения файла ${p}`
                    });
                    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(errMessage);
                    return;
                }
                const json = JSON.parse(data);
                var stud = json.find(stud => stud.id == n);
                if(!stud){
                    const errMessage = JSON.stringify({
                        "error": 2,
                        "message": `Студент с id = ${n} не найден`
                        });
                    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(errMessage);
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(stud));
            });
            return;
    }
    else if(req.method == 'POST'){
        var parts = path.split('/').filter(p => p != '');
        if(parts.length == 0){
            var body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const stud = JSON.parse(body);
                fs.readFile('./StudentList.json', 'utf8', (err, data) => {
                    if (err) {
                        const p = path_s.join(__dirname, 'StudentList.json');
                        const errMessage = JSON.stringify({
                            "error": 1,
                            "message": `Ошибка чтения файла ${p}`
                        });
                        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(errMessage);
                        return;
                    }
                    const json = JSON.parse(data);
                    const stud2 = json.find(st => st.id == stud.id);
                    if(stud2){
                        const errMessage = JSON.stringify({
                            "error": 3,
                            "message": `Студент с id = ${stud.id} уже существует`
                        });
                        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(errMessage);
                        return;
                    }
                    json.push(stud);
                    fs.writeFile('./StudentList.json', JSON.stringify(json), 'utf8', (err) => {
                        if (err) {
                            const p = path_s.join(__dirname, 'StudentList.json');
                            const errMessage = JSON.stringify({
                                "error": 4,
                                "message": `Ошибка записи файла ${p}`
                            });
                            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                            res.end(errMessage);
                            return;
                        }
                        wsS.emit('event', 'File StudentList.json updated');
                        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify(stud));
                        return;
                    });
                });
            });
        }
        else if(parts.length == 1 && parts[0] == 'backup'){
            const t = new Date();
            const YYYY = t.getFullYear();
            const MM = String(t.getMonth() + 1).padStart(2, '0');
            const DD = String(t.getDate()).padStart(2, '0');
            const HH = String(t.getHours()).padStart(2, '0');
            const SS = String(t.getSeconds()).padStart(2, '0');
            const backupName = `${YYYY}${MM}${DD}${HH}${SS}_StudentList.json`;
            const dest = `./${backupName}`;
            setTimeout(() => {
                fs.copyFile('./StudentList.json', dest, err => {
                    if (err) {
                        const errMessage = JSON.stringify({
                            "error": 5,
                            "message": `Ошибка создания резервной копии файла`
                        });
                        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(errMessage);
                        return;
                    }
                
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({
                        "status": "ok",
                        "backup": backupName
                    }));
                });
            }, 2000);
        }
        
    }
    else if(req.method == 'PUT'){
        var parts = path.split('/').filter(p => p != '');
        if(parts.length == 0){
            var body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const stud = JSON.parse(body);
                fs.readFile('./StudentList.json', 'utf8', (err, data) => {
                    if (err) {
                        const p = path_s.join(__dirname, 'StudentList.json');
                        const errMessage = JSON.stringify({
                            "error": 1,
                            "message": `Ошибка чтения файла ${p}`
                        });
                        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(errMessage);
                        return;
                    }
                    const json = JSON.parse(data);
                    const stud2 = json.find(st => st.id == stud.id);
                    if(!stud2){
                        const errMessage = JSON.stringify({
                            "error": 2,
                            "message": `Студент с id = ${stud.id} не найден`
                        });
                        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(errMessage);
                        return;
                    }
                    stud2.name = stud.name;
                    stud2.age = stud.age;
                    stud2.group = stud.group;
                    fs.writeFile('./StudentList.json', JSON.stringify(json), 'utf8', (err) => {
                        if (err) {
                            const p = path_s.join(__dirname, 'StudentList.json');
                            const errMessage = JSON.stringify({
                                "error": 4,
                                "message": `Ошибка записи файла ${p}`
                            });
                            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                            res.end(errMessage);
                            return;
                        }
                        wsS.emit('event', 'File StudentList.json updated');
                        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify(stud2));
                        return;
                    });
                });
            });
        }
    }
    else if(req.method == 'DELETE'){
        var parts = path.split('/').filter(p => p != '');
        if(parts.length == 1){
            var n = parseInt(parts[0], 10);
            if(isNaN(n)){
                const errMessage = JSON.stringify({
                    "error": 5,
                    "message": `Неверный id`
                });
                res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(errMessage);
                return;
            }
            fs.readFile('./StudentList.json', 'utf8', (err, data) => {
                if (err) {
                    const p = path_s.join(__dirname, 'StudentList.json');
                    const errMessage = JSON.stringify({
                        "error": 1,
                        "message": `Ошибка чтения файла ${p}`
                    });
                    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(errMessage);
                    return;
                }
                var json = JSON.parse(data);
                var stud = json.find(stud => stud.id == n);
                if(!stud){
                    const errMessage = JSON.stringify({
                        "error": 2,
                        "message": `Студент с id = ${n} не найден`
                        });
                    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(errMessage);
                    return;
                }
                json = json.filter(st => st.id != n);
                fs.writeFile('./StudentList.json', JSON.stringify(json), 'utf8', (err) => {
                        if (err) {
                            const p = path_s.join(__dirname, 'StudentList.json');
                            const errMessage = JSON.stringify({
                                "error": 4,
                                "message": `Ошибка записи файла ${p}`
                            });
                            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                            res.end(errMessage);
                            return;
                        }
                        wsS.emit('event', 'File StudentList.json updated');
                        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify(stud));
                        return;
                    });
            });
            return;
        }
        else if(parts.length == 2 && parts[0] == 'backup'){
            const date1 = moment(parts[1], 'YYYYMMDD').toDate();
            fs.readdir(__dirname, (err, files) => {
                if (err) {
                    const errMessage = JSON.stringify({
                        "error": 6,
                        "message": `Ошибка чтения содержимого текущей директории`
                    });
                    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(errMessage);
                    return;
                }

                const foundFiles = files.filter(file => {
                  return file.includes('StudentList.json');
                });
                
                foundFiles.forEach(file => {
                    const date2 = moment(file.substring(0, 8), 'YYYYMMDD').toDate();
                    if(date2 < date1){
                        fs.rm(path_s.join(__dirname, file), (err) => {
                             if (err) {
                                const errMessage = JSON.stringify({
                                    "error": 6,
                                    "message": `Ошибка удаления файла ${file}`
                                });
                                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                                res.end(errMessage);
                                return;
                            }
                        });
                    }
                });
            });
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ "message": "Файлы успешно удалены" }));
            return;
        }
    }
}).listen(4000);