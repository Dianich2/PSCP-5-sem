const fs = require('fs');
const WebSocket = require('ws');

const wsS = new WebSocket.Server({ port: 4000, host:'localhost' });

wsS.on('connection', (ws) => {
  const duplex = WebSocket.createWebSocketStream(ws, {encoding:'utf8'});
  let wfile = fs.createWriteStream('upload/MyFile.txt');
  duplex.pipe(wfile);
});
