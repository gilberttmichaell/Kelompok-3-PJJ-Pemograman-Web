// models/UserModel.js

const db = require('../config/database');

const findAll = async () => {
  const [rows] = await db.query(
    `SELECT u.id, u.name, u.email, u.role, u.created_at
     FROM   users u
     ORDER BY u.created_at DESC`
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.query(
    `SELECT u.id, u.name, u.email, u.role, u.created_at
     FROM   users u
     WHERE  u.id = ?`,
    [id]
  );
  return rows[0] ?? null;
};

module.exports = { findAll, findById };