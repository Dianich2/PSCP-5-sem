var http = require('http');
var query = require('querystring');

let parms = JSON.stringify({
    __comment: "Запрос.Лабораторная работа 8/10",
    x:1, 
    y:2, 
    s:"Сообщение",
    m:["a", "b", "c", "d"],
    o:{"surname":"Иванов", "name":"Иван"}
});

let options = {
    host: 'localhost',
    path: `/`,
    port: 3000,
    method: 'POST',
    headers:{
        'content-type': 'application/json', 'accept': 'application/json'
    }
};

const request = http.request(options, (response) =>{
    let body = '';
    response.on('data', (chunk) =>{
        body += chunk.toString();
    });

    response.on('end', () => {
        console.log('Status code: ' + response.statusCode);
        console.log(JSON.parse(body));
    })
});

request.end(parms);