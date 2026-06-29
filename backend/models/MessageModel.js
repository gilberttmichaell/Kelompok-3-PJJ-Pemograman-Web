const db = require("../config/database");

const findAllForUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT m.*,
            s.name AS sender_name,
            r.name AS receiver_name
     FROM messages m
     LEFT JOIN users s ON m.sender_id = s.id
     LEFT JOIN users r ON m.receiver_id = r.id
     WHERE m.sender_id = ? OR m.receiver_id = ?
     ORDER BY m.created_at DESC`,
    [userId, userId]
  );
  return rows;
};

const create = async (senderId, receiverId, message) => {
  const [result] = await db.query(
    "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)",
    [senderId, receiverId, message]
  );
  return result.insertId;
};

const markAsRead = async (id, receiverId) => {
  await db.query(
    "UPDATE messages SET is_read = TRUE WHERE id = ? AND receiver_id = ?",
    [id, receiverId]
  );
};

module.exports = { findAllForUser, create, markAsRead };
