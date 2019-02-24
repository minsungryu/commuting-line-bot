const { Pool } = require('pg');

const pool = new Pool({
    max: 2,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 0
});

module.exports = { pool };