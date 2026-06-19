

const UserModel      = require('../models/UserModel');
const { validateId } = require('../validation/userValidation');

class UserController {

  async index(req, res) {
    try {
      const data = await UserModel.findAll();
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

      const data = await UserModel.findById(id);
      if (!data) return res.status(404).json({ success: false, message: 'Lead tidak ditemukan' });

      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

}

const object = new UserController();
module.exports = object;