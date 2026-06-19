// validations/leadValidation.js
// Step sekarang: validasi ID saja
// Akan dikembangkan di pertemuan berikutnya (CREATE, UPDATE, dll)

const LEAD_STATUS = ['New', 'Contacted', 'Qualified', 'Lost']; //samakan dengan enum di table 
const validateId = (id) => {
  if (!id || isNaN(id)) return 'ID harus berupa angka';
  return null;
};

const validateStore = ({customer_id, title, status} = {}) =>{
    const errors = [];
//kondisi error
    if(!customer_id) errors.push('Customer_id wajib diisi');
    if(!title || !title.trim()) errors.push('title wajib diisi');
    if(title && title.length > 150) errors.push("title maksimal 150 karakter");
    if(status && !LEAD_STATUS.includes(status))
      errors.push(`Status harus: ${LEAD_STATUS.join(', ')}`);

    return errors.length ? errors : null;
}

//validasi update samakan dengan store
const validateUpdate = validateStore

module.exports = {validateId, validateStore, validateUpdate, LEAD_STATUS};