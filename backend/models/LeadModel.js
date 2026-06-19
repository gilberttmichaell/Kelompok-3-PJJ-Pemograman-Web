// models/LeadModel.js

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

module.exports = { findAll, findById };