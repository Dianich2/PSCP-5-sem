const http = require('http');
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://student:fitfit@ixl2k3f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function start() {
    await client.connect();
    const db = client.db('BSTU');

    const server = http.createServer(async function (req, res) {
    let errId = 1;
    if (req.method === 'GET') {
        if (req.url === '/api/faculties') {
            try {
                const db = client.db('BSTU');
                 try {
                    const docs = await db.collection("faculty").find().toArray();
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(docs));
                } catch (err) {
                    console.error(err);
                    res.writeHead(500);
                    res.end("DB error");
                }
            }
            catch (err) {
                res.writeHead(500, {'Content-Type' : 'application/json; charset=utf-8'});
                res.end(JSON.stringify({ error: errId++, message: 'Ошибка при получении факультетов' }));
            };
        }
        else if (req.url === '/api/pulpits') {

        }
        else {
            res.writeHead(404, {'Content-Type' : 'application/json; charset=utf-8'});
            res.end(JSON.stringify({ error: errId++, message: '404 GET: неверно указан uri' }));
        }
    }
    else if (req.method === 'POST') {
        if (req.url === '/api/faculties') {

        }
        else if (req.url === '/api/pulpits') {

        }
        else {
            res.writeHead(404, {'Content-Type' : 'application/json; charset=utf-8'});
            res.end(JSON.stringify({ error: errId++, message: '404 POST: неверно указан uri' }));
        }
    }
    else if (req.method === 'PUT') {
        if (req.url === '/api/faculties') {

        }
        else if (req.url === '/api/pulpits') {

        }
        else {
            res.writeHead(404, {'Content-Type' : 'application/json; charset=utf-8'});
            res.end(JSON.stringify({ error: errId++, message: '404 PUT: неверно указан uri' }));
        }
    }
    else if (req.method === 'DELETE') {
        let pathParts;
        if (req.url.startsWith('/api/faculties/') && (pathParts = req.url.split('/').filter(Boolean)) === 3) {

        }
        else if (req.url.startsWith('/api/pulpits/') && (pathParts = req.url.split('/').filter(Boolean)) === 3) {

        }
        else {
            res.writeHead(404, {'Content-Type' : 'application/json; charset=utf-8'});
            res.end(JSON.stringify({ error: errId++, message: '404 DELETE: неверно указан uri' }));
        }
    }
    else {
        res.writeHead(405, {'Content-Type' : 'application/json; charset=utf-8'});
        res.end(JSON.stringify({ error: errId++, message: '405 Указанный метод не поддерживается' }));
    }
});

    server.listen(3000, () => { console.log('Server is running at http://localhost:3000/'); });
}

start();
