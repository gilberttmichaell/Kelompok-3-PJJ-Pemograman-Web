//file models yang berguna untuk menerjemahkan isi table 
const db = require('../config/database');

//menampilkan seluruh data table user
const findAllUser = async () => {
  const [rows] = await db.query(`
    SELECT id, name, email, role
    FROM users
    ORDER BY id ASC
  `);

  return rows;
}

//menampilkan by id dari table user
const findByIdUser = async (id) => {
const [rows] = await db.query(
    `SELECT id, name, email, role FROM users WHERE id = ?`, [id]
);
return rows[0] ?? null;
}

const findByEmail = async (email) => {
  const [rows] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] ?? null;
};

const store = async ({ name, email, password, role }) => {
  const [{ insertId }] = await db.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role]
  );
  return insertId;
};

const update = async (id, { name, email, password, role }) => {
  const values = [name, email, role];
  let sql = 'UPDATE users SET name=?, email=?, role=?';
  if (password) {
    sql += ', password=?';
    values.push(password);
  }
  sql += ' WHERE id=?';
  values.push(id);
  const [{ affectedRows }] = await db.query(sql, values);
  return affectedRows;
};

const destroy = async (id) => {
  const [{ affectedRows }] = await db.query('DELETE FROM users WHERE id=?', [id]);
  return affectedRows;
};

module.exports = {findAllUser, findByIdUser, findByEmail, store, update, destroy};
