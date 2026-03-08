const { send } = require('./my_pack/m0603');

send('Test!!!')
    .then(result => {
        console.log('Успех:', result);
    })
    .catch(error => {
        console.log('Ошибка:', error);
    });