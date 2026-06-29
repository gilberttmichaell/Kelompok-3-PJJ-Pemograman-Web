
//file models yang berguna untuk menerjemahkan isi table 
const db = require('../config/database');

//menampilkan seluruh data table customers
const findAll = async () =>{
    const [rows] = await db.query(
        `Select id, name, email, phone, company, status FROM customers ORDER BY created_at DESC`
    );
    return rows;
}

//menampilkan by id dari table customers
const findById = async (id) => {
const [rows] = await db.query(
    `Select * FROM customers WHERE id = ?`, [id]
);
return rows[0] ?? null;
}

const store = async ({ name, email, phone, company, status, created_by }) => {
  const [{ insertId }] = await db.query(
    `INSERT INTO customers (name, email, phone, company, status, created_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, email ?? null, phone ?? null, company ?? null, status ?? null, created_by ?? null]
  );
  return insertId;
};

const update = async (id, { name, email, phone, company, status }) => {
  const [{ affectedRows }] = await db.query(
    `UPDATE customers
     SET   name=?, email=?, phone=?, company=?, status=?
     WHERE id=?`,
    [name, email ?? null, phone ?? null, company ?? null, status ?? null, id]
  );
  return affectedRows;
};

const destroy = async (id) => {
  const [{ affectedRows }] = await db.query(
    `DELETE FROM customers WHERE id=?`,
    [id]
  );
  return affectedRows;
};

const destroyRelations = async (id) => {
  await db.query(
    `DELETE d FROM deals d
     INNER JOIN leads l ON d.lead_id = l.id
     WHERE l.customer_id = ?`,
    [id]
  );
  await db.query('DELETE FROM activities WHERE customer_id = ?', [id]);
  await db.query('DELETE FROM contacts WHERE customer_id = ?', [id]);
  await db.query('DELETE FROM leads WHERE customer_id = ?', [id]);
};

module.exports = { findAll, findById, store, update, destroy, destroyRelations };
