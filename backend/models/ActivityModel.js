const db = require('../config/database');

const findAll = async () => {
  const [rows] = await db.query(`
    SELECT
      a.id,
      a.customer_id,
      c.name AS customer_name,
      a.type,
      a.description,
      a.activity_date,
      a.created_by
    FROM activities a
    LEFT JOIN customers c ON a.customer_id = c.id
    ORDER BY a.activity_date DESC
  `);

  return rows;
};

const findById = async (id) => {
  const [rows] = await db.query(`
    SELECT
      a.*,
      c.name AS customer_name
    FROM activities a
    LEFT JOIN customers c ON a.customer_id = c.id
    WHERE a.id = ?
  `, [id]);

  return rows[0] ?? null;
};

const findByCustomerId = async (customerId) => {
  const [rows] = await db.query(`
    SELECT *
    FROM activities
    WHERE customer_id = ?
    ORDER BY activity_date DESC
  `, [customerId]);

  return rows;
};

const store = async ({
  customer_id,
  type,
  description,
  activity_date,
  created_by
}) => {

  const [result] = await db.query(`
    INSERT INTO activities
    (
      customer_id,
      type,
      description,
      activity_date,
      created_by
    )
    VALUES (?, ?, ?, ?, ?)
  `, [
    customer_id,
    type,
    description ?? null,
    activity_date ?? null,
    created_by ?? null
  ]);

  return result.insertId;
};

/**
 * otomatis dipanggil saat customer dibuat
 */
const createFromCustomer = async (
  customerId,
  customerName,
  createdBy = null
) => {

  const [result] = await db.query(`
    INSERT INTO activities
    (
      customer_id,
      type,
      description,
      activity_date,
      created_by
    )
    VALUES (?, ?, ?, NOW(), ?)
  `, [
    customerId,
    'Note',
    `Customer baru "${customerName}" berhasil ditambahkan`,
    createdBy
  ]);

  return result.insertId;
};

const update = async (
  id,
  {
    customer_id,
    type,
    description,
    activity_date,
    created_by
  }
) => {

  const [result] = await db.query(`
    UPDATE activities
    SET
      customer_id=?,
      type=?,
      description=?,
      activity_date=?,
      created_by=?
    WHERE id=?
  `, [
    customer_id,
    type,
    description ?? null,
    activity_date ?? null,
    created_by ?? null,
    id
  ]);

  return result.affectedRows;
};

const destroy = async (id) => {

  const [result] = await db.query(
    `DELETE FROM activities WHERE id = ?`,
    [id]
  );

  return result.affectedRows;
};

const createUpdateActivity = async (
    customerId,
    description,
    createdBy = null
) => {
    await db.query(
        `INSERT INTO activities
        (customer_id, type, description, activity_date, created_by)
        VALUES (?, 'Note', ?, NOW(), ?)`,
        [customerId, description, createdBy]
    );
};

module.exports = {
  findAll,
  findById,
  findByCustomerId,
  store,
  createFromCustomer,
  createUpdateActivity,
  update,
  destroy
};