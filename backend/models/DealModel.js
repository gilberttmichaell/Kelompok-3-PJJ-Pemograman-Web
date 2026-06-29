const db = require('../config/database');

const findAll = async () => {
  const [rows] = await db.query(
    `SELECT d.id, d.title, d.value, d.stage, d.closed_at, d.created_at,
            l.id    AS lead_id,
            l.title AS lead_title,
            c.id    AS customer_id,
            c.name  AS customer_name
     FROM   deals d
     LEFT JOIN leads     l ON d.lead_id     = l.id
     LEFT JOIN customers c ON l.customer_id = c.id
     ORDER BY d.created_at DESC`
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.query(
    `SELECT d.id, d.title, d.value, d.stage, d.closed_at, d.created_at,
            l.id      AS lead_id,
            l.title   AS lead_title,
            l.status  AS lead_status,
            c.id      AS customer_id,
            c.name    AS customer_name,
            c.company AS customer_company
     FROM   deals d
     LEFT JOIN leads     l ON d.lead_id     = l.id
     LEFT JOIN customers c ON l.customer_id = c.id
     WHERE  d.id = ?`,
    [id]
  );
  return rows[0] ?? null;
};

// CRUD manual
const store = async ({ lead_id, title, value, stage, closed_at }) => {
  const [{ insertId }] = await db.query(
    `INSERT INTO deals (lead_id, title, value, stage, closed_at)
     VALUES (?, ?, ?, ?, ?)`,
    [lead_id ?? null, title, value ?? 0, stage ?? null, closed_at ?? null]
  );
  return insertId;
};

const update = async (id, { lead_id, title, value, stage, closed_at }) => {
  const [{ affectedRows }] = await db.query(
    `UPDATE deals
     SET   lead_id=?, title=?, value=?, stage=?, closed_at=?
     WHERE id=?`,
    [lead_id ?? null, title, value ?? 0, stage ?? null, closed_at ?? null, id]
  );
  return affectedRows;
};

const destroy = async (id) => {
  const [{ affectedRows }] = await db.query(
    `DELETE FROM deals WHERE id=?`,
    [id]
  );
  return affectedRows;
};

// business process (dipanggil dari LeadController) — tetap dipertahankan
const createFromLead = async (leadId, title, stage) => {
  const [{ insertId }] = await db.query(
    `INSERT INTO deals (lead_id, title, stage) VALUES (?,?,?)`,
    [leadId, title, stage ?? null]
  );
  return insertId;
};

const updateStageByLeadId = async (leadId, stage, value) => {
  if (value === undefined || value === null || value === '') {
    await db.query("UPDATE deals SET stage=? WHERE lead_id=?", [stage, leadId]);
    return;
  }
  await db.query("UPDATE deals SET stage=?, value=? WHERE lead_id=?", [stage, value, leadId]);
};

const removeByLeadId = async (leadId) => {
  await db.query("DELETE FROM deals WHERE lead_id = ?", [leadId]);
};

module.exports = {
  findAll, findById,
  store, update, destroy,
  createFromLead, updateStageByLeadId, removeByLeadId
};
