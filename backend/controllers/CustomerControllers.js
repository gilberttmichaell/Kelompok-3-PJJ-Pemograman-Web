const CustomerModel = require('../models/CustomerModel');
const ActivityModel = require('../models/ActivityModel');
const db = require('../config/database');
const {
  validateId,
  validateStore,
  validateUpdate,} = require('../validation/customerValidation');

class CustomerController {
  async index(req, res, next) {
  try {
    const customers = await CustomerModel.findAll();

    res.json({
      success: true,
      data: customers
    });
  } catch (err) {
    next(err);
  }
}

async show(req, res, next) {
  try {
    const { id } = req.params;

    const customer = await CustomerModel.findById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer tidak ditemukan"
      });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (err) {
    next(err);
  }
} 
  // POST /customers
  // Body: { name*, email, phone, company, status, created_by }
  async store(req, res, next) {
    try {
      const errors = validateStore(req.body);
      if (errors) return res.status(400).json({ success: false, errors });

      await db.beginTransaction();
      const payload = { ...req.body, created_by: req.user.id };
      const id = await CustomerModel.store(payload);
      const activityId = await ActivityModel.createFromCustomer(id, payload.name, req.user.id);
      await db.commit();
      res.status(201).json({
        success: true,
        message: 'Customer berhasil ditambahkan dan activity otomatis dibuat',
        data: { id, activity_id: activityId },
      });
    } catch (err) {
      try { await db.rollback(); } catch {}
      next(err);
    }
  }

// PUT /customers/:id
  // Body: { name*, email, phone, company, status }
  async update(req, res, next) {
    try {
      const { id } = req.params;

      const idError = validateId(id);
      if (idError) return res.status(400).json({ success: false, message: idError });

      const errors = validateUpdate(req.body);
      if (errors) return res.status(400).json({ success: false, errors });

      await db.beginTransaction();
      const affected = await CustomerModel.update(id, req.body);
      if (!affected) {
        await db.rollback();
        return res.status(404).json({ success: false, message: 'Customer tidak ditemukan' });
      }
      await ActivityModel.createUpdateActivity(
        id,
        `Data customer "${req.body.name}" diperbarui`,
        req.user.id
      );
      await db.commit();

      res.json({ success: true, message: 'Customer berhasil diupdate dan activity dicatat' });
    } catch (err) {
      try { await db.rollback(); } catch {}
      next(err);
    }
  }

  // DELETE /customers/:id
  async destroy(req, res, next) {
    try {
      const { id } = req.params;

      const idError = validateId(id);
      if (idError) return res.status(400).json({ success: false, message: idError });

      await db.beginTransaction();
      await CustomerModel.destroyRelations(id);
      const affected = await CustomerModel.destroy(id);
      if (!affected) {
        await db.rollback();
        return res.status(404).json({ success: false, message: 'Customer tidak ditemukan' });
      }
      await db.commit();

      res.json({ success: true, message: 'Customer dan data terkait berhasil dihapus' });
    } catch (err) {
      try { await db.rollback(); } catch {}
      next(err);
    }
  }
}

const object = new CustomerController();
module.exports = object;
