
//file models yang berguna untuk menerjemahkan isi table 
const db = require('../config/database');

//menampilkan seluruh data table user
const findAllActivity = async () =>{
    const [rows] = await db.query(
        `Select customer_id, type, description FROM activites ORDER BY activity_date DESC`
    );
    return rows;
}

//menampilkan by id dari table user
const findByIdActivity = async (id) => {
const [rows] = await db.query(
    `Select * FROM activities WHERE id = ?`, [id]
);
return rows[0] ?? null;
}

module.exports = {findAllActivity, findByIdActivity};