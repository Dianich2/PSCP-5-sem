const sql = require('mssql/msnodesqlv8');
const config = {
    connectionString: 'DSN=UNIVER_DSN;DATABASE=UNIVER;Trusted_Connection=Yes;'
};

let pool;

async function initPools() {
    pool = await sql.connect(config);
}

function getPool() {
    return pool;
}

module.exports = {
    initPools,
    getPool
}





