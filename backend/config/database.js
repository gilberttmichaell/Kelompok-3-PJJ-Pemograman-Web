// config/database.js

const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("Koneksi database gagal:", err.code || err.message);
    } else {
        console.log("Koneksi database berhasil!", process.env.DB_NAME);
    }
});

module.exports = db.promise();
