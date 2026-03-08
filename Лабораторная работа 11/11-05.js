const rpcWSS = require('rpc-websockets').Server;

const wsS = new rpcWSS({ port: 4000, host:'localhost' });

wsS.setAuth((l)=> {
    return (l.login === 'dianich' && l.password === '222')
});

wsS.register('square', (parms) => {
    if(parms.length == 1){
        return parms[0] * parms[0] * Math.PI;
    }
    else if(parms.length == 2){
        return parms[0] * parms[1];
    }
    else{
        throw new Error('Invalid number of parameters');
    }
}).public();

wsS.register('sum', (parms)=>{
    return parms.reduce((a, b) => a + b, 0);
}).public();

wsS.register('mul', (parms)=>{
    return parms.reduce((a, b) => a * b, 1);
}).public();

wsS.register('fib', (n) => {
    n = +n || 0;
    if (n <= 0) {
        return [];
    }
    if (n === 1) {
        return [0];
    }
    let a = 0;
    let b = 1;
    let result = [a, b];
    for (let i = 2; i < n; i++) {
        const c = a + b;
        result.push(c);
        a = b;
        b = c;
    }
    return result;
}).protected();

wsS.register('fact', (n) => {
    n = +n || 0;
    if(n < 0){
        throw new Error('Invalid number');
    }
    if(n === 0 || n === 1){
        return 1;
    }
    let result = 1;
    for(let i = 2; i <= n; i++){
        result *= i;
    }
    return result;
}).protected();

