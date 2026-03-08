const fs = require('fs');
const WebSocket = require('ws');

const wsC = new WebSocket('ws://localhost:4000');
let k = 0;

wsC.on('open', () => {
  const duplex = WebSocket.createWebSocketStream(wsC, {encoding:'utf8'});
  let wfile = fs.createWriteStream('./MyFile2.txt');
  duplex.pipe(wfile);
});
