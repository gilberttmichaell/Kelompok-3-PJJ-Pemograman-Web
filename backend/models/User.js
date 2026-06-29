const db = require("../config/database")
class User {
    static async findByEmail(email){
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        return rows;
    }

    static async create(data){
        const sql =`INSERT INTO users(name, email, password, role)
        VALUES (?, ?, ?, ?)
        `;
        return await db.query(sql, [data.name, data.email, data.password, data.role]);
    }
}

module.exports= User;

