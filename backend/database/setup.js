const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });

  await connection.query(sql);
  await connection.end();
  console.log(`Database ${process.env.DB_NAME || 'crm_latihan'} siap digunakan.`);
}

main().catch((error) => {
  console.error('Setup database gagal:', error.code || error.message);
  process.exitCode = 1;
});
