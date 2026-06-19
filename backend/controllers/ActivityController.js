

const ActivityModel      = require('../models/ActivityModel');
const { validateId, validateStore, validateUpdate } = require('../validation/activityValidation');

class ActivityController {

  async index(req, res) {
    try {
      const data = await ActivityModel.findAll();
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

      const data = await ActivityModel.findById(id);
      if (!data) return res.status(404).json({ success: false, message: 'Activity tidak ditemukan' });

      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
async store(req, res, next){
 
        // res.send("Menambahkan data");
        try{
            const errors = validateStore(req.body);
            if(errors) return res.status(400).json({success:false, errors});
            const id = await ActivityModel.store(req.body);
            res.status(201).json({
                success: true,
                message: 'Activity berhasil ditambahkan',
                data : {id},
            });
        } catch (err){
            next(err);
        }
    }
 
    async update(req, res, next){
    try{
        const {id} = req.params;
        const idError = validateId(id);
        if (idError) return res.json(400).json({success:false, message: idError});
 
        const errors = validateUpdate(req.body);
        if(errors) return res.status(400).json({success:false, errors});
 
         const affected = await ActivityModel.update(id, req.body)// mengakses id mana yang akan diupdate
         if(!affected) return res.status(404).json({success:false, message: 'Activity Tidak Ditemukan'});
         res.json({success: true, message: 'Activity Berhasil Diupdate'});
        // res.send(`Mengupdate data id ${id}`);
    } catch (err){
        next(err);
    }
}
     async destroy(req, res, next){
        // const {id} = req.params;
        // res.send(`Menghapus data id ${id}`);
         try{
        const {id} = req.params;
        const idError = validateId(id);
        if (idError) return res.json(400).json({success:false, message: idError});
 
         const affected = await ActivityModel.destroy(id, req.body)// mengakses id mana yang akan diupdate
         if(!affected) return res.status(404).json({success:false, message: 'Activity Tidak Ditemukan'});
         
         res.json({success: true, message: 'Activity Berhasil Dihapus'});
        // res.send(`Mengupdate data id ${id}`);
    } catch (err){
        next(err);
    }
    }
}

const object = new ActivityController();
module.exports = object;