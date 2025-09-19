const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'host.docker.internal',
  user: 'root',
  password: 'secret',
  database: 'test-app-k6',
  waitForConnections: true,
  connectionLimit: 25,
  queueLimit: 0
});

module.exports = pool;
