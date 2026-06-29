const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function main() {
  const name = process.env.ADMIN_NAME || 'Administrator';
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || password.length < 6) {
    throw new Error('Isi ADMIN_EMAIL dan ADMIN_PASSWORD (minimal 6 karakter).');
  }

  const hashed = await bcrypt.hash(password, 10);
  await db.query(
    `INSERT INTO users (name, email, password, role)
     VALUES (?, ?, ?, 'admin')
     ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password), role='admin'`,
    [name, email, hashed]
  );
  await db.end();
  console.log(`Admin ${email} siap digunakan.`);
}

main().catch(async (error) => {
  console.error('Gagal membuat admin:', error.message);
  try { await db.end(); } catch {}
  process.exitCode = 1;
});
