// models/leadModel.js

const db = require('../config/database');

const findAll = async () => {
  const [rows] = await db.query(
    `SELECT l.id, l.title, l.source, l.notes, l.status, l.assigned_to, l.created_at,
            c.id   AS customer_id,
            c.name AS customer_name
     FROM   leads l
     LEFT JOIN customers c ON l.customer_id = c.id
     ORDER BY l.created_at DESC`
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.query(
    `SELECT l.id, l.title, l.source, l.notes, l.status, l.assigned_to, l.created_at,
            c.id      AS customer_id,
            c.name    AS customer_name,
            c.company AS customer_company
     FROM   leads l
     LEFT JOIN customers c ON l.customer_id = c.id
     WHERE  l.id = ?`,
    [id]
  );
  return rows[0] ?? null;
};

//menambahkan data leads
const store = async ({customer_id, title, source, notes, status, assigned_to}) =>{
  const [{insertId}] =await db.query(
    `INSERT INTO leads (customer_id, title, source, notes, status, assigned_to)
    VALUES (?,?,?,?,?,?)
    `, 

    [customer_id, title, source ?? null, notes ?? null, status ?? 'New', assigned_to ?? null]

  );
  return insertId;
}

const update = async (id, {customer_id, title, source, notes, status, assigned_to}) => {
  const [{affectedRows}] = await db.query(
    `UPDATE leads SET customer_id=? , title=?, source=?, notes=?, status=?, assigned_to=? WHERE id=? `,
     [customer_id, title, source ?? null, notes ?? null, status ?? 'New', assigned_to ?? null, id]
  );
  return affectedRows;
};

const destroy = async(id) =>{
  const [{affectedRows}] =await db.query(`DELETE FROM leads WHERE id=?`, [id]);
  return affectedRows;
}
module.exports = { findAll, findById, store, update, destroy };