const LEAD_STATUS = ['New', 'Contacted', 'Qualified', 'Won', 'Lost'];

// Dipakai di: show, update, destroy
const validateId = (id) => {
  if (!id || isNaN(id)) return 'ID harus berupa angka';
  return null;
};

// Dipakai di: store
const validateStore = ({ customer_id, title, status, assigned_to } = {}) => {
  const errors = [];

  if (!customer_id)                      errors.push('customer_id wajib diisi');
  if (customer_id && isNaN(customer_id)) errors.push('customer_id wajib berupa angka');
  if (!title || !title.trim())           errors.push('title wajib diisi');
  if (title && title.length > 150)       errors.push('title maksimal 150 karakter');
  if (status && !LEAD_STATUS.includes(status))
    errors.push(`status harus: ${LEAD_STATUS.join(', ')}`);
  if (assigned_to && isNaN(assigned_to)) errors.push('assigned_to harus berupa angka');

  return errors.length ? errors : null;
};

// Dipakai di: update — aturan sama dengan store
const validateUpdate = validateStore;

module.exports = { validateId, validateStore, validateUpdate, LEAD_STATUS };
