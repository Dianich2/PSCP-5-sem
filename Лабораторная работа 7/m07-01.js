var fs = require('fs').promises;
var url = require('url');
var path = require('path');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.png': 'image/png',
    '.docx': 'application/msword',
    '.json': 'application/json; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
    '.mp4': 'video/mp4'
};

function staticH(pathToStatic){
    return async function processingStatic(req, res){
        if(req.method !== 'GET'){
            return;
        }

        try{
            var curPath = req.url;
            if(curPath === '/' || curPath === ''){
                curPath = './07-01.html';
            }

            if(curPath.startsWith('/')) {
                curPath = curPath.substring(1);
            }

            const ext = path.extname(curPath).toLowerCase();

            if(!MIME_TYPES[ext]){
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Not Found');
                return;
            }

            const fullPath=  path.join(pathToStatic, curPath);

            const file = await fs.readFile(fullPath);
            console.log(file);
            console.log(file.length);

             res.writeHead(200, {
                'Content-Type': MIME_TYPES[ext],
                'Content-Length': file.length
            });

            res.end(file);
        }
        catch(err){
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Not Found');
            }
        }
    }
}

module.exports = staticH;