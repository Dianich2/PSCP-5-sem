const fs = require('fs');
const WebSocket = require('ws');
let parm = process.argv[2];
parm = parm == undefined ? 'A' : parm;

const wsC = new WebSocket('ws://localhost:4000');
let k = 0;
// wsC.on('ping', (data) => {
//   wsC.pong(data + ' ' + parm);
// });

wsC.on('message', (data) => {
  console.log(data.toString());
});
