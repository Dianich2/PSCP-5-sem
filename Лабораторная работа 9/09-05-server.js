var http = require('http');
var query = require('querystring');
var url = require('url');
var xml2js = require('xml2js');
var xmlbuilder = require('xmlbuilder');

const parser = new xml2js.Parser();

let handler = (req, res) =>{
    if(req.method == 'GET'){
        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
        res.end('GET');
    }
    else if(req.method == 'POST'){
        var buf = '';
        req.on('data', function(data) {
            buf += data;
        });
        req.on('end', function() {
            var sumX = 0;
            var concM = '';
            var reqId;
            parser.parseString(buf, (err, result) =>{
                result.request.x.forEach(function(xElem) {
                    sumX += parseInt(xElem.$.value) || 0;
                });
                result.request.m.forEach(function(mElem) {
                    concM += mElem.$.value || '';
                });
                reqId = result.request.$.id;
                var xmlRes = xmlbuilder.create('response').att('id', '33').att('request', `${reqId}`);
                xmlRes.ele('sum').att('element', 'x').att('result', `${sumX}`);
                xmlRes.ele('concat').att('element', 'm').att('result', `${concM}`);
                res.writeHead(200, {'Content-Type': 'application/xml; charset=utf-8'});
                res.end(xmlRes.toString({pretty:true}));
            });
        });
    }
}

let server = http.createServer().listen(3000)
.on('request', handler);