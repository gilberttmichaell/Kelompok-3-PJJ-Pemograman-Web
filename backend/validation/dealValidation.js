// validations/dealValidation.js
// Step sekarang: validasi ID saja
// Akan dikembangkan di pertemuan berikutnya (CREATE, UPDATE, dll)

const validateId = (id) => {
  if (!id || isNaN(id)) return 'ID harus berupa angka';
  return null;
};

const DEAL_STAGES = ['Open', 'Proposal', 'Negotiation', 'Won', 'Lost'];

const validateStore = ({ lead_id, title, value, stage, closed_at } = {}) => {
  const errors = [];
  if (!lead_id || isNaN(lead_id)) errors.push('lead_id wajib berupa angka');
  if (!title || !title.trim()) errors.push('title wajib diisi');
  if (value !== undefined && (isNaN(value) || Number(value) < 0)) errors.push('value harus angka positif');
  if (!stage || !DEAL_STAGES.includes(stage)) errors.push(`stage harus: ${DEAL_STAGES.join(', ')}`);
  if (closed_at && isNaN(Date.parse(closed_at))) errors.push('closed_at tidak valid');
  return errors.length ? errors : null;
};

const validateUpdate = validateStore;

module.exports = { validateId, validateStore, validateUpdate, DEAL_STAGES };
