// validations/dealValidation.js
// Step sekarang: validasi ID saja
// Akan dikembangkan di pertemuan berikutnya (CREATE, UPDATE, dll)

const validateId = (id) => {
  if (!id || isNaN(id)) return 'ID harus berupa angka';
  return null;
};

module.exports = { validateId };