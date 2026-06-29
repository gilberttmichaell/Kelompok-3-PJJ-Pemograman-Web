const db        = require('../config/database');
const LeadModel = require('../models/LeadModel');
const DealModel = require('../models/DealModel');
const {
  validateId,
  validateStore,
  validateUpdate,
} = require('../validation/leadValidation');

// Pemetaan status lead → stage deal
// Setiap perubahan status lead otomatis mengubah stage deal
const STAGE_MAP = {
  'New'      : 'Open',
  'Contacted': 'Proposal',     // sudah dihubungi → masuk proposal
  'Qualified': 'Negotiation',  // qualified → sedang negosiasi
  'Won'      : 'Won',
  'Lost'     : 'Lost',         // gagal → deal ikut lost
};

class LeadController {
  async index(req, res, next) {
  try {
    const leads = await LeadModel.findAll();

    res.json({
      success: true,
      data: leads
    });
  } catch (err) {
    next(err);
  }
}

async show(req, res, next) {
  try {
    const { id } = req.params;

    const lead = await LeadModel.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead tidak ditemukan"
      });
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (err) {
    next(err);
  }
}
   // Bisnis proses: buat lead → otomatis buat deal dengan stage sesuai status lead
  async store(req, res, next) {
    try {
      const errors = validateStore(req.body);
      if (errors) return res.status(400).json({ success: false, errors });

      const payload = {
        ...req.body,
        assigned_to: req.user.role === 'admin'
          ? req.body.assigned_to || req.user.id
          : req.user.id,
      };
      const { title, status } = payload;
      const dealStage = STAGE_MAP[status || 'New'];

      await db.beginTransaction();

      const leadId = await LeadModel.store(payload);
      const dealId = await DealModel.createFromLead(leadId, title, dealStage);

      await db.commit();

      res.status(201).json({
        success : true,
        message : 'Lead berhasil dibuat, deal otomatis terbuat',
        data    : {
          lead : { id: leadId, title, status: status || 'New' },
          deal : { id: dealId, stage: dealStage },
        },
      });
    } catch (err) {
      await db.rollback();
      next(err);
    }
  }
  // Bisnis proses: update lead → stage deal ikut berubah sesuai status baru
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const idError = validateId(id);
      if (idError) return res.status(400).json({ success: false, message: idError });

      const errors = validateUpdate(req.body);
      if (errors) return res.status(400).json({ success: false, errors });

      const payload = {
        ...req.body,
        assigned_to: req.user.role === 'admin'
          ? req.body.assigned_to || req.user.id
          : req.user.id,
      };
      const { status, deal_value } = payload;
      const dealStage = STAGE_MAP[status || 'New'];

      await db.beginTransaction();

      const affected = await LeadModel.update(id, payload);
      if (!affected) {
        await db.rollback();
        return res.status(404).json({ success: false, message: 'Lead tidak ditemukan' });
      }
      await DealModel.updateStageByLeadId(id, dealStage, deal_value);
      await db.commit();

      res.json({
        success : true,
        message : 'Lead diupdate, stage deal ikut berubah',
        data    : { lead_status: status, deal_stage: dealStage, deal_value: deal_value ?? null },
      });
    } catch (err) {
      await db.rollback();
      next(err);
    }
  }
  // Bisnis proses: hapus lead → deals terkait ikut terhapus
  async destroy(req, res, next) {
    try {
      const { id } = req.params;
      const idError = validateId(id);
      if (idError) return res.status(400).json({ success: false, message: idError });

      await db.beginTransaction();

      await DealModel.removeByLeadId(id);  // hapus deals dulu (FK constraint)
      const affected = await LeadModel.destroy(id);

      if (!affected) {
        await db.rollback();
        return res.status(404).json({ success: false, message: 'Lead tidak ditemukan' });
      }

      await db.commit();
      res.json({ success: true, message: 'Lead dan deals terkait berhasil dihapus' });
    } catch (err) {
      await db.rollback();
      next(err);
    }
  }
}


const object = new LeadController();
module.exports = object;
