
//file models yang berguna untuk menerjemahkan isi table 
const db = require('../config/database');

//menampilkan seluruh data table user
const findAllContact = async () =>{
    const [rows] = await db.query(
        `Select customer_id, name, email, phone, position FROM contacts ORDER BY created_at DESC`
    );
    return rows;
}

//menampilkan by id dari table user
const findById = async (id) => {
const [rows] = await db.query(
    `Select * FROM contacts WHERE id = ?`, [id]
);
return rows[0] ?? null;
}

module.exports = {findAllContact, findById};