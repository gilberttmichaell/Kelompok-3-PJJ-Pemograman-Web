// controllers/leadController.js
const db = require('../config/database');
const LeadModel      = require('../models/LeadModel');
const DealModel = require('../models/DealModel');
const { validateId, validateStore, validateUpdate } = require('../validation/leadValidation');

//perbandingan status antara table leads dengan table deals
const STAGE_MAP = {
  'New' : null,
  'Contacted' : 'Proposal',
  'Qualified' : 'Negotiation',
  'Lost' : 'Lost'
}
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

  async store(req, res, next){
       // res.send("Menambahkan data");
        try{
            const errors = validateStore(req.body);
            if(errors) return res.status(400).json({success:false, errors});
          
            const {title, status} = req.body;
            const dealStage = STAGE_MAP[status || 'New'];
            //transaction => digunakan untuk transaksi data dan bisa disimpan atau dikembalikan 
            //disimpan menggunakan commit, dan dikembalikan menggunakan rollback
            await db.beginTransaction();

            const leadId = await LeadModel.store(req.body);
            const dealId = await DealModel.createFormLead(leadId, title, dealStage);
            await db.commit();

            res.status(201).json({
              success: true,
              message : "Lead Berhasil Bertambah, Deal Otomatis Bertambah",
              data : {
                lead : {id: leadId, title, status: status || 'New'},
                deal : { id: dealId, stage: dealStage},
              },
            });
  } catch(err) {
    await db.rollback();
    next(err);
  }

}

async update(req, res, next) {
  try{
    const {id} = req.params;
    const idError = validateId(id);
    if(idError) return res.status(400).json({success:false, message: idError});

    const errors = validateUpdate(req.body);
    if(errors) return res.status(400).json({success:false, errors});

    const{status, deal_value} = req.body;
    const dealStage = STAGE_MAP[status || 'New'];
    await db.beginTransaction();
    const affected = await LeadModel.update(id, req.body);
    if(!affected) {
      await db.rollback();
      return res.status(404).json({success:false, message:"Lead Tidak Ditemukan"});
    }
    await DealModel.updateStageByLeadId(id,dealStage,deal_value ?? null);
    await db.commit();
    res.json({
      success: true,
      message: "Lead Diupdate, Stage Deal Ikut Berubah",
      data : {lead_status: status, dead_stage: dealStage, deal_value: deal_value ?? null},
    });
  } catch (err) {
    await db.rollback();
    next(err);
  }
}
async destroy (req,res,next){
  try{
    const {id} = req.params;
    const idError = validateId(id);
    if(idError) return res.status(400).json({success:false, message: idError});

    await db.beginTransaction();
    await DealModel.removeByLeadId(id);
    const affected = await LeadModel.destroy(id);
    if(!affected){
      await db.rollback();
      return res.status(404).json({success:false, message: "Lead Tidak Ditemukan"})
    
    }
    await db.commit();
    res.json({success: true, message: 'Lead Berhasil Dihapus'});
  } catch (err) {
    await db.rollback();
    next(err);
}
}
}
const object = new LeadController();
module.exports = object;