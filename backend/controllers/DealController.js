const DealModel = require('../models/DealModel');
const { validateId, validateStore, validateUpdate } = require('../validation/dealValidation');

class DealController {

  async index(req, res, next) {
    try {
      const data = await DealModel.findAll();
      res.json({ success: true, total: data.length, data });
    } catch (err) {
      next(err);
    }
  }

  async show(req, res, next) {
    try {
      const { id } = req.params;
      const error = validateId(id);
      if (error) return res.status(400).json({ success: false, message: error });

      const data = await DealModel.findById(id);
      if (!data) return res.status(404).json({ success: false, message: 'Deal tidak ditemukan' });

      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async store(req, res, next) {
    try {
      const errors = validateStore(req.body);
      if (errors) return res.status(400).json({ success: false, errors });

      const id = await DealModel.store(req.body);
      res.status(201).json({
        success: true,
        message: 'Deal berhasil ditambahkan',
        data: { id }
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const error = validateId(id);
      if (error) return res.status(400).json({ success: false, message: error });
      const errors = validateUpdate(req.body);
      if (errors) return res.status(400).json({ success: false, errors });

      const affected = await DealModel.update(id, req.body);
      if (!affected) return res.status(404).json({ success: false, message: 'Deal tidak ditemukan' });

      res.json({ success: true, message: 'Deal berhasil diupdate' });
    } catch (err) {
      next(err);
    }
  }

  async destroy(req, res, next) {
    try {
      const { id } = req.params;
      const error = validateId(id);
      if (error) return res.status(400).json({ success: false, message: error });

      const affected = await DealModel.destroy(id);
      if (!affected) return res.status(404).json({ success: false, message: 'Deal tidak ditemukan' });

      res.json({ success: true, message: 'Deal berhasil dihapus' });
    } catch (err) {
      next(err);
    }
  }
}

const object = new DealController();
module.exports = object;
