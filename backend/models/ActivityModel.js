// models/ActivityModel.js

const db = require('../config/database');

const findAll = async () => {
  const [rows] = await db.query(
    `SELECT a.id, a.type, a.description, a.activity_date,
            c.id   AS customer_id,
            c.name AS customer_name,
            u.id AS created_by,
            u.name AS user_name
     FROM   activities a
     LEFT JOIN customers c ON a.customer_id = c.id
     LEFT JOIN users u ON a.created_by = u.id
     ORDER BY a.activity_date DESC`
  );
  return rows;
}

const findById = async (id) => {
  const [rows] = await db.query(
    `SELECT a.id, a.type, a.description, a.activity_date,
            c.id   AS customer_id,
            c.name AS customer_name,
            u.id AS created_by,
            u.name AS user_name
     FROM   activities a
     LEFT JOIN customers c ON a.customer_id = c.id
     LEFT JOIN users u ON a.created_by = u.id
     WHERE  a.id = ?`,
    [id]
  );
  return rows[0] ?? null;
}

//Menambahkan data activities
const store = async({customer_id, type, description, activity_date, created_by}) => {//parameter sesuaikan dengan kolom yang ada di table
    const [{insertId}] = await db.query(
        `INSERT INTO activities (customer_id, type, description, activity_date, created_by) VALUES (?, ?, ?, ?, ?)`,
        [customer_id, type ?? null, description ?? null, activity_date ?? null, created_by ?? null]
    );
return insertId;
}

//Mengupdate data activities
const update = async(id, {customer_id, type, description, activity_date}) => {
const [{affectedRows}] = await db.query(
    `UPDATE activities SET customer_id=?, type=?, description=?, activity_date=? WHERE id=?`,
    [customer_id, type ?? null, description ?? null, activity_date ?? null, id]
);
return affectedRows;
}

//Menghapus data activities
const destroy = async (id) =>{
    const[{affectedRows}] = await db.query (`DELETE FROM activities WHERE id=?`, [id]);
    return affectedRows;
}

module.exports = { findAll, findById, store, update, destroy };