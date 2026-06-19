//validasi data yang diakses harus angka

const ACTIVITY_TYPE = ['Call', 'Email', 'Meeting', 'Note']; //samakan dengan enum di table 
const validateId = (id) => {
  if (!id || isNaN(id)) return 'ID harus berupa angka';
  return null;
};

const validateStore = ({customer_id, type} = {}) =>{
    const errors = [];
//kondisi error
    if(!customer_id) errors.push('Customer ID Wajib Diisi');
    if(type && !ACTIVITY_TYPE.includes(type)) errors.push(`Type harus: ${ACTIVITY_TYPE.join(', ')}`);

    return errors.length ? errors : null;
}

//validasi update samakan dengan store
const validateUpdate = validateStore

module.exports = {validateId, validateStore, validateUpdate, ACTIVITY_TYPE};