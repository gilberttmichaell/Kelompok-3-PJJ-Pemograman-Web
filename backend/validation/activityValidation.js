const validateId = (id) => {
  if (!id || isNaN(id)) return 'ID harus berupa angka';
  return null;
};

// Dipakai di: store
const validateStore = ({customer_id, type, description, activity_date, created_by } = {}) => {
  const errors = [];

  if (!customer_id || isNaN(customer_id))  errors.push('customer_id wajib berupa angka');
  const allowedTypes = ['Call', 'Email', 'Meeting', 'Note'];
  if (!type)                               errors.push('type wajib diisi');
    else if (!allowedTypes.includes(type)) errors.push('type harus salah satu: Call, Email, Meeting, Note');
  if (description && description.length > 1000) errors.push('description maksimal 1000 karakter');
  if (activity_date && isNaN(Date.parse(activity_date))) errors.push('activity_date tidak valid');
  return errors.length ? errors : null;
};

// Dipakai di: update
const validateUpdate = validateStore;

module.exports = { validateId, validateStore, validateUpdate };
