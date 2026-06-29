const ActivityModel = require('../models/ActivityModel');
const {validateId, validateStore, validateUpdate} = require('../validation/activityValidation');
class ActivityController{
    async index(req, res){
        // const data = {
        //     message: "Menampilkan data activity",
        //     data: [],
        // };
        // res.json(data);
        // res.send("Menampilkan data activity");
        try {
            const data = await ActivityModel.findAll();
            res.json({success: true, total: data.length, data});
        } catch(err){
            res.status(500).json({success:false, message: err.message});
        }
 
    }
    //menampilkan by id dari table activity
    async show (req, res){
        try {
            const {id} = req.params;
            const error = validateId(id);
            if(error) return res.status(400).json({success: false, message: error});
 
            const data = await ActivityModel.findById(id);
            if(!data) return res.status(404).json({success: false, message: "User tidak ditemukan"});
            res.json ({success:true, data});
        } catch(err){
            res.status(500).json({success: false, message: err.message});
        }
    }
    async store(req, res) {
  try {

    const {
      customer_id,
      type,
      description,
      activity_date,
      created_by
    } = req.body;

    const errors = validateStore(req.body);
    if (errors) return res.status(400).json({ success: false, errors });

    const id = await ActivityModel.store({
      customer_id,
      type,
      description,
      activity_date,
      created_by: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Activity berhasil ditambahkan',
      id
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
}
     async destroy(req, res) {

  try {

    const { id } = req.params;

    const affectedRows =
      await ActivityModel.destroy(id);

    if (!affectedRows) {
      return res.status(404).json({
        success: false,
        message: 'Activity tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Activity berhasil dihapus'
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

}

    async update(req, res) {

  try {
    
    const { id } = req.params;
    const idError = validateId(id);
    if (idError) return res.status(400).json({ success: false, message: idError });
    const errors = validateUpdate(req.body);
    if (errors) return res.status(400).json({ success: false, errors });

    const affectedRows =
      await ActivityModel.update(id, { ...req.body, created_by: req.user.id });

    if (!affectedRows) {
      return res.status(404).json({
        success: false,
        message: 'Activity tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Activity berhasil diupdate'
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
}
}
const object = new ActivityController();
 
module.exports = object;
