const validateId = (id) => {
  if (!id || isNaN(id)) return 'ID harus berupa angka';
  return null;
};

// Dipakai di: store
const validateStore = ({ customer_id, name, email, phone, position } = {}) => {
  const errors = [];

  if (!customer_id || isNaN(customer_id)) errors.push('customer_id wajib berupa angka');
  if (!name || !name.trim())        errors.push('name wajib diisi');
  if (name && name.length > 100)    errors.push('name maksimal 100 karakter');
  if (email && email.length > 100)  errors.push('email maksimal 100 karakter');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('format email tidak valid');
  if (phone && phone.length > 20)   errors.push('phone maksimal 20 karakter');

  return errors.length ? errors : null;
};

// Dipakai di: update — aturan sama dengan store
const validateUpdate = validateStore;

module.exports = { validateId, validateStore, validateUpdate };
