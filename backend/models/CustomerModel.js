
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

module.exports = {findAll, findById};