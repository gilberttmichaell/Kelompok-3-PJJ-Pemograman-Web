const db = require('../config/database');

const getSummary = async () => {
  const [[customers]] = await db.query(`SELECT COUNT(*) AS total FROM customers`);
  const [[leads]]     = await db.query(`SELECT COUNT(*) AS total FROM leads`);
  const [[deals]]     = await db.query(`SELECT COUNT(*) AS total FROM deals`);

  const [leadByStatus] = await db.query(
    `SELECT status, COUNT(*) AS total FROM leads GROUP BY status`
  );
  const [dealByStatus] = await db.query(
    `SELECT stage, COUNT(*) AS total FROM deals GROUP BY stage`
  );

  return {
    customers: customers.total,
    leads: leads.total,
    deals: deals.total,
    leads_by_status: leadByStatus,
    deal_by_status: dealByStatus,
  };
};

module.exports = { getSummary };