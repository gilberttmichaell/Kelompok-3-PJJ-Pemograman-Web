//validasi data yang diakses harus angka

const validateId = (id) => {
    if(!id || isNaN(id)) return 'ID harus berupa angka';
    return null;
};

const validateStore = ({name, email, phone, company, status} = {}) =>{
    const errors = [];
//kondisi error
    if(!name || !name.trim()) errors.push('Nama Wajib Diisi');
    if(name && name.length > 100) errors.push('Nama Maksimal 100 Karakter');
    if(email && email.length > 100) errors.push('Email Maksimal 100 Karakter');
    if(phone && phone.length > 20) errors.push('Phone Maksimal 20 Karakter');

    return errors.length ? errors : null;
}

//validasi update samakan dengan store
const validateUpdate = validateStore
module.exports = {validateId, validateStore, validateUpdate};