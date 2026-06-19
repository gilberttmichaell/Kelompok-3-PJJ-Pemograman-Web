// controllers/leadController.js

const LeadModel      = require('../models/LeadModel');
const { validateId } = require('../validation/leadValidation');

class LeadController {

  async index(req, res) {
    try {
      const data = await LeadModel.findAll();
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

      const data = await LeadModel.findById(id);
      if (!data) return res.status(404).json({ success: false, message: 'Lead tidak ditemukan' });

      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

}

const object = new LeadController();
module.exports = object;