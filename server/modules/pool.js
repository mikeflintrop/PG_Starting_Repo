const pg = require('pg');

const Pool = pg.Pool;

// creat a new pool instance to manage connections
const pool = new Pool({
    database: 'music_library', // changes with database name
    host: 'localhost',
    port: 5432, // default port for PostgreSQL
    max: 10, // max is how many connections (queries) allowed at one time
    idleTimeoutMillis: 30000 // idle timeout 30 seconds, otherwise query is cancelled
});

// not required, but useful for debugging
pool.on('connect', () => {
    console.log('PostgreSQL pool connection established!')
});

pool.on('error', (error) => {
    console.log('PostgreSQL pool connection error!', error);
})

// allow access to this pool from other code
module.exports = pool;