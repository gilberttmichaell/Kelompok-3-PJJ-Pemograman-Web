
//file models yang berguna untuk menerjemahkan isi table 
const db = require('../config/database');

//menampilkan seluruh data table user
const findAllContact = async () => {
  const [rows] = await db.query(`
    SELECT ct.id, ct.customer_id, c.name AS customer_name, ct.name, ct.email, ct.phone, ct.position
    FROM contacts ct LEFT JOIN customers c ON ct.customer_id = c.id ORDER BY ct.created_at DESC
  `);
  return rows;
}

//menampilkan by id dari table user
const findById = async (id) => {
const [rows] = await db.query(
    `Select * FROM contacts WHERE id = ?`, [id]
);
return rows[0] ?? null;
}

const store = async ({ customer_id, name, email, phone, position }) => {
  const [{ insertId }] = await db.query(
    `INSERT INTO contacts (customer_id, name, email, phone, position)
     VALUES (?, ?, ?, ?, ?)`,
    [customer_id, name, email ?? null, phone ?? null, position ?? null]
  );
  return insertId;
};

const update = async (id, { customer_id, name, email, phone, position }) => {
  const [{ affectedRows }] = await db.query(
    `UPDATE contacts
     SET   customer_id=?, name=?, email=?, phone=?, position=?
     WHERE id=?`,
    [customer_id, name, email ?? null, phone ?? null, position ?? null, id]
  );
  return affectedRows;
};

const destroy = async (id) => {
  const [{ affectedRows }] = await db.query(
    `DELETE FROM contacts WHERE id=?`,
    [id]
  );
  return affectedRows;
};

module.exports = {findAllContact, findById, store, update, destroy};