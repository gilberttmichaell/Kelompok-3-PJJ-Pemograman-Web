// controllers/dealController.js

const DealModel      = require('../models/DealModel');
const { validateId } = require('../validation/dealValidation');

class DealController {

  async index(req, res) {
    try {
      const data = await DealModel.findAll();
      res.json({ success: true, total: data.length, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;

      const error = validateId(id);
      if (error) return res.status(400).json({ success: false, message: error });

      const data = await DealModel.findById(id);
      if (!data) return res.status(404).json({ success: false, message: 'Deal tidak ditemukan' });

      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

}

const object = new DealController();
module.exports = object;