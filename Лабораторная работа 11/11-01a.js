const fs = require('fs');
const WebSocket = require('ws');

const wsC = new WebSocket('ws://localhost:4000');
let k = 0;

wsC.on('open', () => {
  const duplex = WebSocket.createWebSocketStream(wsC, {encoding:'utf8'});
  let rfile = fs.createReadStream('./MyFile.txt');
  rfile.pipe(duplex);
});
