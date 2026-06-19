// models/ContactModel.js

const db = require('../config/database');

const findAll = async () => {
  const [rows] = await db.query(
    `SELECT cc.id, cc.name, cc.email, cc.phone, cc.position, cc.created_at,
            c.id   AS customer_id,
            c.name AS customer_name
     FROM   contacts cc
     LEFT JOIN customers c ON cc.customer_id = c.id
     ORDER BY cc.created_at DESC`
  );
  return rows;
}

const findById = async (id) => {
  const [rows] = await db.query(
    `SELECT cc.id, cc.name, cc.email, cc.phone, cc.position, cc.created_at,
            c.id   AS customer_id,
            c.name AS customer_name
     FROM   contacts cc
     LEFT JOIN customers c ON cc.customer_id = c.id
     WHERE  cc.id = ?`,
    [id]
  );
  return rows[0] ?? null;
}

//Menambahkan data contacts
const store = async({customer_id, name, email, phone, position}) => {//parameter sesuaikan dengan kolom yang ada di table
    const [{insertId}] = await db.query(
        `INSERT INTO contacts (customer_id, name, email, phone, position) VALUES (?, ?, ?, ?, ?)`,
        [customer_id, name, email ?? null, phone ?? null, position ?? null]
    );
return insertId;
}

//Mengupdate data contacts
const update = async(id, {customer_id, name, email, phone, position}) => {
const [{affectedRows}] = await db.query(
    `UPDATE contacts SET customer_id=?, name=?, email=?, phone=?, position=? WHERE id=?`,
    [customer_id, name, email ?? null, phone ?? null, position ?? null, id]
);
return affectedRows;
}

//Menghapus data activities
const destroy = async (id) =>{
    const[{affectedRows}] = await db.query (`DELETE FROM contacts WHERE id=?`, [id]);
    return affectedRows;
}

module.exports = { findAll, findById, store, update, destroy };