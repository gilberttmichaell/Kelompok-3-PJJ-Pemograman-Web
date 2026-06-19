
//file models yang berguna untuk menerjemahkan isi table 
const db = require('../config/database');

//menampilkan seluruh data table customers
const findAll = async () =>{
    const [rows] = await db.query(
        `SELECT * FROM customers ORDER BY created_at DESC`
    );
    return rows;
}

//menampilkan by id dari table customers
const findById = async (id) => {
    const [rows] = await db.query(
        `SELECT * FROM customers WHERE id = ?`, [id]
    );
    return rows[0] ?? null;
}

//Menambahkan data customers
const store = async({name, email, phone, company, status, created_by}) => {//parameter sesuaikan dengan kolom yang ada di table
    const [{insertId}] = await db.query(
        `INSERT INTO customers (name, email, phone, company, status, created_by) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email ?? null, phone ?? null, company ?? null, status ?? null, created_by ?? null]
    );
return insertId;
}

//Mengupdate data customers
const update = async(id, {name, email, phone, company, status}) => {
const [{affectedRows}] = await db.query(
    `UPDATE customers SET name=?, email=?, phone=?, company=?, status=? WHERE id=?`,
    [name, email ?? null, phone ?? null, company ?? null, status ?? null, id]
);
return affectedRows;
}

//Menghapus data customers
const destroy = async (id) =>{
    const[{affectedRows}] = await db.query (`DELETE FROM customers WHERE id=?`, [id]);
    return affectedRows;
}

module.exports = {findAll, findById, store, update, destroy};