const db = require("../config/database");

const findAll = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );
  return rows;
};

const create = async (userId, message, actionUrl = null) => {
  const [result] = await db.query(
    "INSERT INTO notifications (user_id, message, action_url) VALUES (?, ?, ?)",
    [userId, message, actionUrl]
  );
  return result.insertId;
};

const markAsRead = async (id, userId) => {
  await db.query(
    "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?",
    [id, userId]
  );
};

module.exports = { findAll, create, markAsRead };
