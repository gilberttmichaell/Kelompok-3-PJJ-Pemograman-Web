const ContactModel = require('../models/ContactModel');
const {validateId, validateStore, validateUpdate} = require('../validation/contactValidation');
class  ContactController{
    async index(req, res, next){
        try {
            const data = await ContactModel.findAllContact();
            res.json({success: true, total: data.length, data});
        } catch(err){
            res.status(500).json({success:false, message: err.message});
        }
 
    }
    //menampilkan by id dari table contact
    async show(req, res, next) {
  try {
    const { id } = req.params;
    const contact = await ContactModel.findById(id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact tidak ditemukan" });
    }
    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
}
    async store(req, res, next){
        try {
      const errors = validateStore(req.body);
      if (errors) return res.status(400).json({ success: false, errors });

      const id = await ContactModel.store(req.body);
      res.status(201).json({
        success: true,
        message: 'Contact berhasil ditambahkan',
        data: { id },
      });
    } catch (err) {
      next(err);
    }
    }

    async update(req, res, next) {
    try {
      const { id } = req.params;

      const idError = validateId(id);
      if (idError) return res.status(400).json({ success: false, message: idError });

      const errors = validateUpdate(req.body);
      if (errors) return res.status(400).json({ success: false, errors });

      const affected = await ContactModel.update(id, req.body);
      if (!affected) return res.status(404).json({ success: false, message: 'Contact tidak ditemukan' });

      res.json({ success: true, message: 'Contact berhasil diupdate' });
    } catch (err) {
      next(err);
    }
  }
    async destroy(req, res, next) {
    try {
      const { id } = req.params;

      const idError = validateId(id);
      if (idError) return res.status(400).json({ success: false, message: idError });

      const affected = await ContactModel.destroy(id);
      if (!affected) return res.status(404).json({ success: false, message: 'Contact tidak ditemukan' });

      res.json({ success: true, message: 'Contact berhasil dihapus' });
    } catch (err) {
      next(err);
    }
  }
}
const object = new ContactController();
 
module.exports = object;
