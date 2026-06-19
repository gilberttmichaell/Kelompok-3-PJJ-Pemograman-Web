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
};

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
};

module.exports = { findAll, findById };