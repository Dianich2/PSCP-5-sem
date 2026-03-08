const rpcWSC = require('rpc-websockets').Client;
const async = require('async');
const wsC = new rpcWSC('ws://localhost:4000');

let h = (x=wsC) => async.parallel({
    square1: cb => {
        x.call('square', [3])
            .catch(e => cb(e, null))
            .then(r => cb(null, r));
    },
    square2: cb => {
        x.call('square', [5, 4])
            .catch(e => cb(e, null))
            .then(r => cb(null, r));
    },

    sum1: cb => {
        x.call('sum', [2])
            .catch(e => cb(e, null))
            .then(r => cb(null, r));
    },
    sum2: cb => {
        x.call('sum', [2, 4, 6, 8, 10])
            .catch(e => cb(e, null))
            .then(r => cb(null, r));
    },

    mul1: cb => {
        x.call('mul', [3])
            .catch(e => cb(e, null))
            .then(r => cb(null, r));
    },
    mul2: cb => {
        x.call('mul', [3, 5, 7, 9, 11, 13])
            .catch(e => cb(e, null))
            .then(r => cb(null, r));
    },

    fib1: cb => {
        x.login({ login: 'dianich', password: '222' })
            .then(login => {
                if (!login)
                    return cb({ message: 'login error' }, null);

                x.call('fib', 1)
                    .catch(e => cb(e, null))
                    .then(r => cb(null, r));
            });
    },

    fib2: cb => {
        x.login({ login: 'dianich', password: '222' })
            .then(login => {
                if (!login)
                    return cb({ message: 'login error' }, null);

                x.call('fib', 7)
                    .catch(e => cb(e, null))
                    .then(r => cb(null, r));
            });
    },

    fact1: cb => {
        x.login({ login: 'dianich', password: '222' })
            .then(login => {
                if (!login)
                    return cb({ message: 'login error' }, null);

                x.call('fact', 5)
                    .catch(e => cb(e, null))
                    .then(r => cb(null, r));
            });
    },

    fact2: cb => {
        x.login({ login: 'dianich', password: '222' })
            .then(login => {
                if (!login)
                    return cb({ message: 'login error' }, null);

                x.call('fact', 10)
                    .catch(e => cb(e, null))
                    .then(r => cb(null, r));
            });
    },

}, (err, results) => {
    if (err) console.log('e = ', err);
    else     console.log('r = ', results);

    wsC.close();
});

wsC.on('open', () => {
  h();
});
