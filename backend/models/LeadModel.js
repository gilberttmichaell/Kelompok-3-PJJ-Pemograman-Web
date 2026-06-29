const db = require('../config/database');

const findAll = async () => {
  const [data] = await db.query(`
    SELECT l.*,
           c.name AS customer_name,
           c.company AS customer_company,
           u.name AS assigned_name,
           d.id AS deal_id,
           d.stage AS deal_stage,
           d.value AS deal_value
    FROM leads l
    LEFT JOIN customers c ON c.id = l.customer_id
    LEFT JOIN users u ON u.id = l.assigned_to
    LEFT JOIN deals d ON d.lead_id = l.id
    ORDER BY l.created_at DESC
  `);
  return data;
};

const findById = async (id) => {
  const [[data]] = await db.query(`
    SELECT l.*,
           c.name AS customer_name,
           c.company AS customer_company,
           u.name AS assigned_name,
           d.id AS deal_id,
           d.stage AS deal_stage,
           d.value AS deal_value
    FROM leads l
    LEFT JOIN customers c ON c.id = l.customer_id
    LEFT JOIN users u ON u.id = l.assigned_to
    LEFT JOIN deals d ON d.lead_id = l.id
    WHERE l.id=?
  `, [id]);
  return data;
};

const store = async ({ customer_id, title, source, notes, status, assigned_to }) => {
  const [{ insertId }] = await db.query(
    `INSERT INTO leads (customer_id, title, source, notes, status, assigned_to)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [customer_id, title, source ?? null, notes ?? null, status ?? 'New', assigned_to ?? null]
  );
  return insertId;
};

const update = async (id, { customer_id, title, source, notes, status, assigned_to }) => {
  const [{ affectedRows }] = await db.query(
    `UPDATE leads
     SET   customer_id=?, title=?, source=?, notes=?, status=?, assigned_to=?
     WHERE id=?`,
    [customer_id, title, source ?? null, notes ?? null, status ?? 'New', assigned_to ?? null, id]
  );
  return affectedRows;
};

const destroy = async (id) => {
  const [{ affectedRows }] = await db.query(
    `DELETE FROM leads WHERE id=?`,
    [id]
  );
  return affectedRows;
};

module.exports = { findAll, findById, store, update, destroy };
