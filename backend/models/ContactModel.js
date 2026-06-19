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
};

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
};

module.exports = { findAll, findById };