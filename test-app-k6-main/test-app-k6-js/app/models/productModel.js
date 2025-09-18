const pool = require('../db');

exports.create = async (name) => {
  const [result] = await pool.execute('INSERT INTO products (name) VALUES (?)', [name]);
  return result.insertId;
};

exports.getAll = async () => {
  const [rows] = await pool.execute('SELECT id, name FROM products limit 10');
  return rows;
};

exports.searchByName = async (q) => {
  const [rows] = await pool.execute(
    'SELECT id, name FROM products WHERE name LIKE ? limit 10',
    [`%${q}%`]
  );
  return rows;
};