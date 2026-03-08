const { database, resolver } = require('./db');
const http = require('http');
const fs = require('fs');
const { graphql, buildSchema } = require('graphql');
const { initPools } = require('./config');

const schemaS = fs.readFileSync('./BSTU.gql').toString();
const schema = buildSchema(schemaS);

const server = http.createServer(async (req, res) => {

    if (req.url === '/graphql' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            res.setHeader('Content-Type', 'application/json');
            
            try {
                const parsedBody = JSON.parse(body);
                const result = await graphql({
                    schema: schema,
                    source: parsedBody.query,
                    rootValue: resolver,
                    variableValues: parsedBody.variables,
                });
                            console.log(result);
                res.writeHead(200);
                res.end(JSON.stringify(result));

            } catch (error) {
                console.error('Error:', error);
                res.writeHead(400);
                res.end(JSON.stringify({ 
                    errors: [{ message: 'Invalid JSON or GraphQL request: ' + error.message }] 
                }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('GraphQL endpoint not found. Use POST to /graphql');
    }
});

const PORT = 4000;

initPools()
    .then(() => {
        server.listen(PORT, () => {
        });
    })
    .catch(err => {
        console.error('Failed to initialize MSSQL pool:', err);
        process.exit(1);
    });