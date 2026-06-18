
//file models yang berguna untuk menerjemahkan isi table 
const db = require('../config/database');

//menampilkan seluruh data table user
const findAllUser = async () =>{
    const [rows] = await db.query(
        `Select name, email, role FROM users ORDER BY created_at DESC`
    );
    return rows;
}

//menampilkan by id dari table user
const findByIdUser = async (id) => {
const [rows] = await db.query(
    `Select * FROM users WHERE id = ?`, [id]
);
return rows[0] ?? null;
}

module.exports = {findAllUser, findByIdUser};