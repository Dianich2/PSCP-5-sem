const fs = require('fs');
const WebSocket = require('ws');

const wsS = new WebSocket.Server({ port: 4000, host:'localhost' });

wsS.on('connection', (ws) => {
  const duplex = WebSocket.createWebSocketStream(ws, {encoding:'utf8'});
  let rfile = fs.createReadStream('upload/MyFile.txt');
  rfile.pipe(duplex);
});
